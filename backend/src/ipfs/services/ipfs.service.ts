import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HeliaLibp2p } from 'helia';
import { S3 } from '@aws-sdk/client-s3';
import { Ipfs } from '../entities/ipfs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IpfsMapper } from '../mapper/ipfs.mapper';
import { IpfsDto } from '../dto/ipfs.dto';
import { importDynamic } from 'src/util/import-dynamic';

@Injectable()
export class IpfsService {
  private helia?: HeliaLibp2p;
  private fs;
  private s3: S3;
  private s3Bucket;
  private logger = new Logger(IpfsService.name);

  constructor(
    @InjectRepository(Ipfs)
    private readonly ipfsRepository: Repository<Ipfs>,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3({
      region: this.configService.getOrThrow('MINIO_REGION'),
      endpoint: this.configService.getOrThrow('MINIO_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('MINIO_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow('MINIO_SECRET_KEY'),
      },
      forcePathStyle: true,
    });
    this.s3Bucket = this.configService.getOrThrow('MINIO_BUCKET');

    // this.s3 = new S3({
    //   region: this.configService.getOrThrow('AWS_REGION'),
    //   credentials: {
    //     accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY'),
    //     secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    //   },
    //   forcePathStyle: true,
    // });
    // this.s3Bucket = this.configService.getOrThrow('AWS_BUCKET');
  }

  async createBlockstore() {
    const { S3Blockstore } = await importDynamic('blockstore-s3');
    const blockstore = new S3Blockstore(this.s3, this.s3Bucket);

    // const { MemoryBlockstore } = await importDynamic('blockstore-core');
    // const blockstore = new MemoryBlockstore();
    return blockstore;
  }
  async createDatastore() {
    // const { S3Datastore } = await eval("import('datastore-s3')");
    // const datastore = new S3Datastore(this.s3, this.s3Bucket, {
    //   path: '.ipfs/datastore',
    //   createIfMissing: false,
    // });
    // application-specific data lives in the datastore
    const { MemoryDatastore } = await importDynamic('datastore-core');
    const datastore = new MemoryDatastore('/.ipfs/ipfs-datastore');
    return datastore;
  }

  async createLibP2P(datastore) {
    const { createLibp2p } = await importDynamic('libp2p');
    const { bootstrap } = await importDynamic('@libp2p/bootstrap');
    const { identify } = await importDynamic('@libp2p/identify');
    const { tcp } = await importDynamic('@libp2p/tcp');
    const { noise } = await importDynamic('@chainsafe/libp2p-noise');
    const { yamux } = await importDynamic('@chainsafe/libp2p-yamux');
    const libp2p = await createLibp2p({
      datastore,
      addresses: {
        listen: ['/ip4/127.0.0.1/tcp/0'],
      },
      transports: [tcp()],
      connectionEncryption: [noise()],
      streamMuxers: [yamux()],
      peerDiscovery: [
        bootstrap({
          list: [
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
          ],
        }),
      ],
      services: {
        identify: identify(),
      },
    });
    return libp2p;
  }

  async getHelia(): Promise<HeliaLibp2p> {
    if (this.helia == null) {
      const blockstore = await this.createBlockstore();
      const datastore = await this.createDatastore();
      // libp2p is the networking layer that underpins Helia
      const libp2p = this.createLibP2P(datastore);
      const { createHelia } = await importDynamic('helia');
      this.helia = await createHelia({ blockstore, datastore, libp2p });
      this.logger.log(
        'Helia is running, PeerId ' + this.helia.libp2p.peerId.toString(),
      );
    }

    return this.helia;
  }

  async getFs() {
    if (this.fs == null) {
      const { unixfs } = await importDynamic('@helia/unixfs');
      this.fs = await unixfs(this.helia);
    }
    return this.fs;
  }

  // async onApplicationShutdown(): Promise<void> {
  //   if (this.helia != null) {
  //     await this.helia.stop();
  //   }
  // }

  async addDoc(file: Express.Multer.File): Promise<IpfsDto> {
    await this.getHelia();
    await this.getFs();
    const multiaddrs = this.helia.libp2p.getMultiaddrs();
    console.log('multiaddrs: ' + multiaddrs);
    const { ipns } = await importDynamic('@helia/ipns');
    //const { CID } = await importDynamic('multiformats/cid');
    const name = ipns(this.helia);
    // create a public key to publish as an IPNS name
    const keyInfo = await this.helia.libp2p.services.keychain.createKey(
      'my-key',
      'RSA',
    );
    const peerId = await this.helia.libp2p.services.keychain.exportPeerId(
      keyInfo.name,
    );
    console.log('PeerID; ', peerId);
    const fileObj = Object.values(file.buffer);
    const contentType = file.mimetype;
    // const cid = await this.fs.addFile({
    //   path: file.originalname,
    //   content: Uint8Array.from(fileObj),
    //   mode: 0x755,
    // });
    const cid = await this.fs.addBytes(Uint8Array.from(fileObj));
    //console.log('CID: ' + cid);
    // const cidAlt = await CID.parse(cid);
    // console.log('CID: ' + cid);

    const ret1 = this.helia.pins.add(cid);
    ret1.next().then((res) => console.log('Ret: ' + res.value));

    // publish the name
    await name.publish(peerId, cid);

    // resolve the name
    const resolved = await name.resolve(peerId);

    console.info('cid: ' + resolved.cid);
    console.info('path: ' + resolved.path.toString());

    // for await (const event of this.helia.libp2p.services.dht.provide(cid)) {
    //   console.log(event);
    // }
    const cidAsString = cid.toString();
    const result = await this.insertCid(cidAsString, contentType);

    // const publishResult = await this.helia.name.publish(cid);
    // console.log('Published to IPNS:', publishResult.name);

    return IpfsMapper.ipfsCidToIpfsDto(result);
  }

  private async insertCid(cid: string, contentType: string): Promise<Ipfs> {
    const data = {
      cid: cid,
      contentType: contentType,
    };
    const existingCid = await this.ipfsRepository.findOne({
      where: { cid: data.cid },
    });
    if (existingCid) {
      //throw new ConflictException(`Document already uploaded`);
      return await this.ipfsRepository.save(existingCid);
    }
    const created = this.ipfsRepository.create(data);
    return await this.ipfsRepository.save(created);
  }

  async findDoc(cid: string): Promise<IpfsDto> {
    await this.getHelia();
    await this.getFs();

    const decoder = new TextDecoder();
    let text = '';

    for await (const chunk of this.fs.cat(cid)) {
      text += decoder.decode(chunk, {
        stream: true,
      });
    }
    return IpfsMapper.docContentToIpfsDto(text);
  }
}
