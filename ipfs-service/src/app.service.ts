import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
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
//import { autoNAT } from '@libp2p/autonat';
//import { uPnPNAT } from '@libp2p/upnp-nat';
//import { gossipsub } from '@chainsafe/libp2p-gossipsub';
//import { webRTC, webRTCDirect } from '@libp2p/webrtc';
import {
  circuitRelayTransport,
  circuitRelayServer,
} from '@libp2p/circuit-relay-v2';
import { IpfsMapper } from './mapper/ipfs.mapper.js';
import { IpfsDto } from './dto/ipfs.dto.js';
import { PeerId } from '@libp2p/interface';

const libp2pOptions = {
  addresses: {
    listen: [
      // add a listen address (localhost) to accept TCP connections on a random port
      '/ip4/0.0.0.0/tcp/4001',
      '/ip4/0.0.0.0/tcp/4001/ws',
      '/ip4/0.0.0.0/udp/4001/quic',
    ]
  },
  transports: [
    tcp(),
    webSockets({ filter: all }),
    circuitRelayTransport({ discoverRelays: 3 }),
  ],
  connectionEncryption: [
    noise()
  ],
  streamMuxers: [
    yamux()
  ],
  peerDiscovery: [
    bootstrap({
      list: [
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
        '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
          ]
    })
  ],
  services: {
    identify: identify(),
    dcutr: dcutr(),
    aminoDHT: kadDHT({
      protocol: '/ipfs/kad/1.0.0',
      peerInfoMapper: removePrivateAddressesMapper,
      validators: { ipns: ipnsValidator },
      selectors: { ipns: ipnsSelector },
    }),
    relay: circuitRelayServer({ advertise: true }),
    keychain: keychain(),
  }
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
    if (existingKeys.some(x => x.name === keyName)) {
      this.ipnsPeerId = await this.helia.libp2p.services.keychain.exportPeerId(
        keyName,
      );
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
    this.fs = unixfs(this.helia);
    const fileBuffer = Buffer.from(file.buffer);
    const fileObj = Object.values(fileBuffer);
    const cid: CID = await this.fs.addBytes(Uint8Array.from(fileObj));
    this.logger.log(`Added file: ${cid}`);

    const ret1 = this.helia.pins.add(cid);
    ret1.next().then((res) => this.logger.log(`Ret: ${res.value}`));

    // publish the name
    await this.ipns.publish(this.ipnsPeerId, cid);
 
    // resolve the name
    const result = await this.ipns.resolve(this.ipnsPeerId);
    this.logger.log(`Result cid: ${result.cid}`);
    this.logger.log(`Result path: ${result.path}`);

    const content = fileBuffer.toString('utf-8');

    return IpfsMapper.ipfsToIpfsDto(cid.toString(), content);
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
    this.fs = unixfs(this.helia);
    const encoder = new TextEncoder();
    const jsonContent = JSON.stringify(json);
    const cid: CID = await this.fs.addBytes(encoder.encode(jsonContent));
    this.logger.log(`Added json: ${cid}`);

    const ret1 = this.helia.pins.add(cid);
    ret1.next().then((res) => this.logger.log(`Pinned json: ${res.value}`));

    const url = 'https://ipfs.io/ipfs/' + cid.toString()

    return IpfsMapper.ipfsToIpfsDto(cid.toString(), jsonContent, url);
  }
}
