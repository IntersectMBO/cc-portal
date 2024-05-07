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
import { ipns } from '@helia/ipns';
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

@Injectable()
export class AppService implements OnModuleInit {
  private helia: HeliaLibp2p;
  private fs;
  private cid?: CID;
  private ipns;
  private ipnsPeerId;
  private logger = new Logger(AppService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    console.log(`Initialization helia...`);
    await this.getHelia();
    //await this.getIpns();
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.helia != null) {
      await this.helia.stop();
    }
  }

  async createLibP2P() {
    const libP2P: any = await createLibp2p({
      addresses: {
        listen: [
          '/ip4/0.0.0.0/tcp/4001',
          '/ip4/0.0.0.0/tcp/4001/ws',
          '/ip4/0.0.0.0/udp/4001/quic',
        ],
      },
      transports: [
        tcp(),
        webSockets({ filter: all }),
        circuitRelayTransport({ discoverRelays: 3 }),
      ],
      connectionEncryption: [noise()],
      streamMuxers: [yamux(), mplex()],
      peerDiscovery: [
        bootstrap({
          list: [
            '/dnsaddr/sg1.bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
            '/dnsaddr/sv15.bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
            '/dnsaddr/am6.bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
            '/dnsaddr/ny5.bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
          ],
        }),
      ],
      services: {
        dcutr: dcutr(),
        identify: identify(),
        // autoNAT: autoNAT(),
        // upnp: uPnPNAT(),
        // pubsub: gossipsub({
        //   emitSelf: true,
        //   canRelayMessage: true,
        // }),
        aminoDHT: kadDHT({
          protocol: '/ipfs/kad/1.0.0',
          peerInfoMapper: removePrivateAddressesMapper,
          validators: { ipns: ipnsValidator },
          selectors: { ipns: ipnsSelector },
        }),
        relay: circuitRelayServer({ advertise: true }),
      },
    });
    return libP2P;
  }

  async getHelia(): Promise<HeliaLibp2p> {
    if (this.helia == null) {
      const blockstore = new FsBlockstore('ipfs/blockstore');
      const datastore = new LevelDatastore('ipfs/datastore');
      await datastore.open();
      const libp2p = await this.createLibP2P();

      this.helia = await createHelia({ blockstore, datastore, libp2p });
      //await this.helia.libp2p.services.dht.setMode('server');

      this.logger.log('PeerId: ' + this.helia.libp2p.peerId.toString());
      this.helia.libp2p
        .getMultiaddrs()
        .forEach((ma) => console.log(ma.toString()));

      // Listen for new peers
      // this.helia.libp2p.addEventListener('peer:discovery', (evt) => {
      //   const peer = evt.detail;
      //   // dial them when we discover them
      //   this.helia.libp2p.dial(peer.id).catch((err) => {
      //     console.log(`Could not dial ${peer.id}`, err);
      //   });
      // });
      // // // Listen for new connections to peers
      // this.helia.libp2p.addEventListener('peer:connect', (evt) => {
      //   const connection = evt.detail;
      //   console.log(`Connected to ${connection.toString()}`);

      //   // this.helia.libp2p
      //   //   .getPeers()
      //   //   .forEach((peers) => console.log('\nPeers: ' + peers));
      // });
      // // Listen for peers disconnecting
      // this.helia.libp2p.addEventListener('peer:disconnect', (evt) => {
      //   const connection = evt.detail;
      //   console.log(`Disconnected from ${connection.toCID().toString()}`);
      // });
    }

    return this.helia;
  }

  async getIpns() {
    this.ipns = ipns(this.helia);
    // create a public key to publish as an IPNS name
    const keyInfo = await this.helia.libp2p.services.keychain.createKey(
      'my-key4',
      'RSA',
    );
    this.ipnsPeerId = await this.helia.libp2p.services.keychain.exportPeerId(
      keyInfo.name,
    );
    console.log('PeerID; ', this.ipnsPeerId);
  }

  async addDoc(file: Express.Multer.File): Promise<IpfsDto> {
    this.fs = unixfs(this.helia);
    const fileBuffer = Buffer.from(file.buffer);
    const fileObj = Object.values(fileBuffer);
    const cid: CID = await this.fs.addBytes(Uint8Array.from(fileObj));
    console.log('\nAdded file:', cid);

    const ret1 = this.helia.pins.add(cid);
    ret1.next().then((res) => console.log('Ret: ' + res.value));

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
}
