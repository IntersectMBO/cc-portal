import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { createHelia } from 'helia';
import { CID } from 'multiformats/cid';
import * as raw from 'multiformats/codecs/raw';
import { bootstrap } from '@libp2p/bootstrap';
import { identify } from '@libp2p/identify';
import { webSockets } from '@libp2p/websockets';
import { tcp } from '@libp2p/tcp';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { unixfs } from '@helia/unixfs';
import { FsBlockstore } from 'blockstore-fs';
import { FsDatastore } from 'datastore-fs';
import { IPNS, ipns } from '@helia/ipns';
import { keychain } from '@libp2p/keychain';
import { kadDHT, removePrivateAddressesMapper } from '@libp2p/kad-dht';
import { ipnsSelector } from 'ipns/selector';
import { ipnsValidator } from 'ipns/validator';
import { dcutr } from '@libp2p/dcutr';
import { autoNAT } from '@libp2p/autonat';
import { ping } from '@libp2p/ping';
import { uPnPNAT } from '@libp2p/upnp-nat';
import { mdns } from '@libp2p/mdns';
import { createDelegatedRoutingV1HttpApiClient } from '@helia/delegated-routing-v1-http-api-client';
import {
  circuitRelayTransport,
  circuitRelayServer,
} from '@libp2p/circuit-relay-v2';
import { IpfsMapper } from './mapper/ipfs.mapper.js';
import { IpfsDto } from './dto/ipfs.dto.js';
import { PeerId } from '@libp2p/interface';
import { config } from 'dotenv';
import { ProvideToDHTProducer } from './queues/producers/provide-to-dht.producer.js';
import { PrunePeerStoreProducer } from './queues/producers/prune-peer-store.producer.js';
import { ProvideAllCidsProducer } from './queues/producers/provide-all-cids.producer.js';
import fs from 'fs';
config();

const libp2pOptions = {
  addresses: {
    listen: [
      // add a listen address (localhost) to accept TCP connections on a random port
      process.env.LISTEN_TCP_ADDRESS,
      process.env.LISTEN_WS_ADDRESS,
      // process.env.LISTEN_QUIC_ADDRESS,
    ],
    announce: [
      process.env.ANNOUNCE_TCP_ADDRESS,
      process.env.ANNOUNCE_WS_ADDRESS,
    ],
  },
  connectionManager: {
    minConnections: 50, // Set a minimum number of connections
    maxConnections: 300, // Adjust based on your requirements
  },
  connectionGater: {
    denyDialPeer: () => false, // Allow all peers
    denyDialMultiaddr: () => false, // Allow all multiaddresses
    denyInboundConnection: () => false, // Allow inbound connections
    denyOutboundConnection: () => false, // Allow outbound connections
  },
  transports: [
    // circuitRelayTransport({ discoverRelays: 1 }),
    tcp(),
    webSockets(),
  ],
  connectionEncryption: [noise()],
  streamMuxers: [yamux()],
  peerDiscovery: [
    mdns(),
    bootstrap({
      list: [
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
        // va1 is not in the TXT records for _dnsaddr.bootstrap.libp2p.io yet
        // so use the host name directly
        '/dnsaddr/va1.bootstrap.libp2p.io/p2p/12D3KooWKnDdG3iXw9eTFijk3EWSunZcFi54Zka4wmtqtt6rPxc8',
        '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
      ],
    }),
  ],
  services: {
    autoNAT: autoNAT(),
    dcutr: dcutr(),
    delegatedRouting: () =>
      createDelegatedRoutingV1HttpApiClient(
        'https://delegated-ipfs.dev/routing/v1',
      ),
    dht: kadDHT({
      clientMode: false,
      peerInfoMapper: removePrivateAddressesMapper,
      protocol: '/ipfs/kad/1.0.0',
      validators: { ipns: ipnsValidator },
      selectors: { ipns: ipnsSelector },
    }),
    identify: identify(),
    keychain: keychain(),
    ping: ping(),
    // relay: circuitRelayServer(),
    upnp: uPnPNAT(),
  },
};

@Injectable()
export class AppService implements OnModuleInit {
  private helia;
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

  async getHelia() {
    if (this.helia == null) {
      const blockstore = new FsBlockstore('ipfs/blockstore');
      const datastore = new FsDatastore('ipfs/datastore');
      await datastore.open();

      this.helia = await createHelia({
        blockstore,
        datastore,
        libp2p: libp2pOptions,
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
