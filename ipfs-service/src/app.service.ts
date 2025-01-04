import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { createHelia } from 'helia';
import type { HeliaLibp2p } from 'helia';
import { CID } from 'multiformats/cid';
import * as raw from 'multiformats/codecs/raw';
import { unixfs } from '@helia/unixfs';
import { FsBlockstore } from 'blockstore-fs';
import { LevelDatastore } from 'datastore-level';
import { IPNS, ipns } from '@helia/ipns';
import { IpfsMapper } from './mapper/ipfs.mapper.js';
import { IpfsDto } from './dto/ipfs.dto.js';
import { PeerId } from '@libp2p/interface';
import { config } from 'dotenv';
import { ProvideToDHTProducer } from './queues/producers/provide-to-dht.producer.js';
import { PrunePeerStoreProducer } from './queues/producers/prune-peer-store.producer.js';
import { ProvideAllCidsProducer } from './queues/producers/provide-all-cids.producer.js';
import fs from 'fs';
config();

@Injectable()
export class AppService implements OnModuleInit {
  private helia: HeliaLibp2p;
  private fs;
  private ipns: IPNS;
  private ipnsPeerId: PeerId;
  private logger = new Logger(AppService.name);

  constructor(
    private readonly provideToDHTProducer: ProvideToDHTProducer,
    private readonly prunePeerStoreProducer: PrunePeerStoreProducer,
    private readonly provideAllCidsProducer: ProvideAllCidsProducer,
  ) {}

  async onModuleInit() {
    console.log(`Initialization helia...`);
    await this.getHelia();
    await this.getIpns();
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.helia != null) {
      await this.helia.stop();
    }
  }

  async getHelia(): Promise<HeliaLibp2p> {
    if (this.helia == null) {
      const blockstore = new FsBlockstore('ipfs/blockstore');
      const datastore = new LevelDatastore('ipfs/datastore');
      await datastore.open();

      this.helia = await createHelia({
        blockstore,
        datastore,
      });

      this.logger.log('PeerId: ' + this.helia.libp2p.peerId.toString());
      this.helia.libp2p
        .getMultiaddrs()
        .forEach((ma) => console.log(ma.toString()));
    }
    return this.helia;
  }

  async getIpns() {
    this.ipns = ipns(this.helia);
    const keyName = process.env.IPNS_CONSTITUTION_KEY_NAME;
    const existingKeys = await this.helia.libp2p.services.keychain.listKeys();
    // if keyName already exists
    if (existingKeys.some((x) => x.name === keyName)) {
      this.ipnsPeerId =
        await this.helia.libp2p.services.keychain.exportPeerId(keyName);
      this.logger.log(`IPNS PeerID: ${this.ipnsPeerId}`);
      return;
    }
    // create a public key to publish as an IPNS name
    const keyInfo = await this.helia.libp2p.services.keychain.createKey(
      keyName,
      'RSA',
    );
    this.ipnsPeerId = await this.helia.libp2p.services.keychain.exportPeerId(
      keyInfo.name,
    );
    this.logger.log(`IPNS PeerID: ${this.ipnsPeerId}`);
  }

  async addFile(file: Express.Multer.File): Promise<IpfsDto> {
    try {
      this.fs = unixfs(this.helia);
      const fileBuffer = Buffer.from(file.buffer);
      const fileObj = Object.values(fileBuffer);

      // Add doc to IPFS
      const cid: CID = await this.fs.addBytes(Uint8Array.from(fileObj));
      this.logger.log(`Added file: ${cid}`);

      // Pin doc
      const ret1 = this.helia.pins.add(cid);
      ret1.next().then((res) => this.logger.log(`Pinned: ${res.value}`));

      // Announce CID to the DHT via queue
      await this.provideToDHTProducer.addToQueue(cid.toString());

      // Publish the name
      await this.ipns.publish(this.ipnsPeerId, cid);

      // Resolve the name
      const result = await this.ipns.resolve(this.ipnsPeerId);
      this.logger.log(`Result cid: ${result.cid}`);
      this.logger.log(`Result path: ${result.record.value}`);

      const content = fileBuffer.toString('utf-8');

      return IpfsMapper.ipfsToIpfsDto(cid.toString(), content);
    } catch (error) {
      this.logger.error(`Final error: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async addJson(json: string): Promise<IpfsDto> {
    try {
      this.fs = unixfs(this.helia);
      const encoder = new TextEncoder();
      const jsonContent = JSON.stringify(json);
      const cid: CID = await this.fs.addBytes(encoder.encode(jsonContent));
      this.logger.log(`Added json: ${cid}`);

      const ret1 = this.helia.pins.add(cid);
      ret1.next().then((res) => this.logger.log(`Pinned json: ${res.value}`));

      // Announce CID to the DHT via queue
      await this.provideToDHTProducer.addToQueue(cid.toString());

      const url = process.env.IPFS_PUBLIC_URL + cid.toString();

      return IpfsMapper.ipfsToIpfsDto(cid.toString(), jsonContent, url);
    } catch (error) {
      this.logger.error(`Final error: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async getDocByCid(cidString: string): Promise<IpfsDto> {
    try {
      this.fs = unixfs(this.helia);
      const decoder = new TextDecoder();
      const cid = CID.parse(cidString);

      let text = '';
      for await (const chunk of this.fs.cat(cid)) {
        text += decoder.decode(chunk, {
          stream: true,
        });
      }
      return IpfsMapper.ipfsToIpfsDto(cidString, text);
    } catch (error) {
      this.logger.error(
        `Failed to get doc by CID - ${cidString} error: ${error}`,
      );
      return null;
    }
  }

  async provideCidtoDHTViaQueue(cid: CID) {
    await this.helia.libp2p.contentRouting.provide(cid);
    this.logger.log(`Announced CID to the DHT: ${cid.toString()}`);
  }

  async getIpnsUrl(): Promise<string> {
    if (!this.ipnsPeerId) {
      throw new InternalServerErrorException(`IPNS Peer Id not exists`);
    }
    const ipnsUrl = process.env.IPNS_PUBLIC_URL + this.ipnsPeerId.toString();
    return ipnsUrl;
  }

  async addPrunePeerStoreJob(): Promise<void> {
    await this.prunePeerStoreProducer.addToQueue(process.env.MAX_PEERS);
  }

  async prunePeerStore(maxPeers: number): Promise<void> {
    let removedPeers = 0;
    const peers = await this.helia.libp2p.peerStore.all();
    this.logger.debug(`Total number of stored peers: ${peers.length}`);

    if (peers.length > maxPeers) {
      const excessPeers = peers.slice(0, peers.length - maxPeers);
      for (const peer of excessPeers) {
        await this.helia.libp2p.peerStore.delete(peer.id);
        removedPeers++;
      }
    }
    this.logger.debug(`Removed peers: ${removedPeers}`);
  }

  async provideCidsToDHTViaQueue(cids: string[]) {
    for (const value of cids) {
      const cid = CID.parse(value);
      this.logger.debug('Job triggered: Provide to DHT - CID:', cid.toString());
      await this.helia.libp2p.contentRouting.provide(cid);
      this.logger.log(`Announced CID to the DHT: ${cid.toString()}`);
    }
  }

  async addProvideAllCidsJob() {
    try {
      const perPage = Number(process.env.PROVIDE_ALL_CIDS_PER_PAGE);
      const allCids = await this.getAllCidsFromBlockstore();
      this.logger.debug(`Total number of stored CIDs: ${allCids.length}`);
      if (allCids.length > 0) {
        const paginatedCids = this.paginateArray(allCids, perPage);
        for (const page of paginatedCids) {
          await this.provideAllCidsProducer.addToQueue(page);
        }
      }
    } catch (err) {
      this.logger.error(`Error add provide all cids job: ${err}`);
    }
  }

  private async getAllCidsFromBlockstore(): Promise<string[]> {
    try {
      const blockstorePath = 'ipfs/blockstore';
      if (!fs.existsSync(blockstorePath)) {
        return [];
      }
      const files = this.helia.blockstore.getAll();
      const cids: string[] = [];
      for await (const file of files) {
        const cidV1 = file.cid.toV1();
        // Create a new CID with the `raw` codec
        const rawCid = CID.create(1, raw.code, cidV1.multihash);
        cids.push(rawCid.toString());
      }
      return cids;
    } catch (err) {
      this.logger.error('Error listing blocks:', err);
    }
  }

  private paginateArray<T>(array: T[], perPage: number): T[][] {
    const paginated: T[][] = [];
    for (let i = 0; i < array.length; i += perPage) {
      paginated.push(array.slice(i, i + perPage));
    }
    return paginated;
  }
}
