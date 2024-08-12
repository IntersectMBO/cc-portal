import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHelia } from 'helia';
import type { HeliaLibp2p } from 'helia';
import { CID } from 'multiformats/cid';
import { createLibp2p } from 'libp2p';
import { bootstrap } from '@libp2p/bootstrap';
import { identify } from '@libp2p/identify';
import { webSockets } from '@libp2p/websockets';
import { all } from '@libp2p/websockets/filters';
import { tcp } from '@libp2p/tcp';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { mplex } from '@libp2p/mplex';
import { unixfs } from '@helia/unixfs';
import { FsBlockstore } from 'blockstore-fs';
import { LevelDatastore } from 'datastore-level';
import { IPNS, ipns } from '@helia/ipns';
import { keychain, type Keychain } from '@libp2p/keychain';
import { kadDHT, removePrivateAddressesMapper } from '@libp2p/kad-dht';
import { ipnsSelector } from 'ipns/selector';
import { ipnsValidator } from 'ipns/validator';
import { dcutr } from '@libp2p/dcutr';
import { autoNAT } from '@libp2p/autonat';
import { ping } from '@libp2p/ping';
import { uPnPNAT } from '@libp2p/upnp-nat';
import { mdns } from '@libp2p/mdns';
import { createDelegatedRoutingV1HttpApiClient } from '@helia/delegated-routing-v1-http-api-client';
//import { gossipsub } from '@chainsafe/libp2p-gossipsub';
//import { webRTC, webRTCDirect } from '@libp2p/webrtc';
import {
  circuitRelayTransport,
  circuitRelayServer,
} from '@libp2p/circuit-relay-v2';
import { IpfsMapper } from './mapper/ipfs.mapper.js';
import { IpfsDto } from './dto/ipfs.dto.js';
import { PeerId } from '@libp2p/interface';
import { config } from 'dotenv';
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
    circuitRelayTransport({ discoverRelays: 1 }),
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
  // services: {
  //   autoNAT: autoNAT(),
  //   dcutr: dcutr(),
  //   delegatedRouting: () =>
  //     createDelegatedRoutingV1HttpApiClient('https://delegated-ipfs.dev'),
  //   dht: kadDHT({
  //     clientMode: false,
  //     initialQuerySelfInterval: 1000,
  //     kBucketSize: 20,
  //     protocol: '/ipfs/kad/1.0.0',
  //     maxInboundStreams: 32,
  //     maxOutboundStreams: 64,
  //     validators: { ipns: ipnsValidator },
  //     selectors: { ipns: ipnsSelector },
  //   }),
  //   identify: identify(),
  //   keychain: keychain(),
  //   ping: ping(),
  //   relay: circuitRelayServer({
  //     advertise: true,
  //     hopTimeout: 60000,
  //   }),
  //   upnp: uPnPNAT(),
  // },
};

@Injectable()
export class AppService implements OnModuleInit {
  private helia;
  private fs;
  private ipns: IPNS;
  private ipnsPeerId: PeerId;
  private logger = new Logger(AppService.name);

  constructor(private readonly configService: ConfigService) {}

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
    const keyName = 'my-key11';
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

  async addDoc(file: Express.Multer.File): Promise<IpfsDto> {
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

      // Announce CID to the DHT
      //this.provideCidtoDHT(cid);

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

  async getDoc(cid: string): Promise<IpfsDto> {
    this.fs = unixfs(this.helia);
    const decoder = new TextDecoder();
    let text = '';

    for await (const chunk of this.fs.cat(cid)) {
      text += decoder.decode(chunk, {
        stream: true,
      });
    }
    return IpfsMapper.ipfsToIpfsDto(cid, text);
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

      // Announce CID to the DHT
      //this.provideCidtoDHT(cid);

      const url = process.env.IPFS_PUBLIC_URL + cid.toString();

      return IpfsMapper.ipfsToIpfsDto(cid.toString(), jsonContent, url);
    } catch (error) {
      this.logger.error(`Final error: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  private provideCidtoDHT(cid, retryDelay = 5000) {
    let attempt = 0;
    let errCode = null;

    const attemptToProvide = async () => {
      try {
        await this.helia.libp2p.contentRouting.provide(cid);
        this.logger.log(`Announced CID to the DHT: ${cid.toString()}`);
      } catch (error) {
        this.logger.error(`Error announcing CID to the DHT: ${error}`);
        errCode = error.code;
        if (errCode === 'ERR_QUERY_ABORTED') {
          attempt++;
          this.logger.log(`Retrying... (${attempt})`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          attemptToProvide(); // Retry
        } else {
          this.logger.log(`CID: ${cid} has not been announced`);
          this.logger.error(error);
          throw new InternalServerErrorException(error);
        }
      }
    };

    attemptToProvide();
  }
}
