import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHelia } from 'helia';
import { CID } from 'multiformats/cid';
import { bootstrap } from '@libp2p/bootstrap';
import { identify } from '@libp2p/identify';
import { webSockets } from '@libp2p/websockets';
import { tcp } from '@libp2p/tcp';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { unixfs } from '@helia/unixfs';
import { FsBlockstore } from 'blockstore-fs';
import { LevelDatastore } from 'datastore-level';
import { IPNS, ipns } from '@helia/ipns';
import { keychain, type Keychain } from '@libp2p/keychain';
import { kadDHT } from '@libp2p/kad-dht';
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
config();

const libp2pOptions = {
  config: {
    dht: {
      enabled: true
    }
  },
  addresses: {
    listen: [
      // add a listen address (localhost) to accept TCP connections on a random port
      process.env.LISTEN_TCP_ADDRESS,
      process.env.LISTEN_WS_ADDRESS,
      process.env.LISTEN_QUIC_ADDRESS,
    ],
  },
  transports: [
    tcp(),
    webSockets(),
  ],
  connectionEncryption: [noise()],
  streamMuxers: [yamux()],
  peerDiscovery: [
   mdns(),
    bootstrap({
      list: [
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
        '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
        '/ip4/104.131.131.82/udp/4001/quic-v1/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
      ],
    }),
  ],
  services: {
    autoNAT: autoNAT(),
    dcutr: dcutr(),
    delegatedRouting: () =>
      createDelegatedRoutingV1HttpApiClient('https://delegated-ipfs.dev'),
    dht: kadDHT({
      clientMode: false,
      protocol: '/ipfs/kad/1.0.0',
      validators: { ipns: ipnsValidator },
      selectors: { ipns: ipnsSelector },
    }),
    identify: identify(),
    keychain: keychain(),
    ping: ping(),
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

  constructor(private readonly provideToDHTProducer: ProvideToDHTProducer) {}

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
      const datastore = new LevelDatastore('ipfs/datastore');
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
    this.logger.error(`Failed to get doc by CID - ${cidString} error: ${error}`);
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
    const ipnsUrl = process.env.IPNS_PUBLIC_URL + this.ipnsPeerId.toString()
    return ipnsUrl;
  }
}
