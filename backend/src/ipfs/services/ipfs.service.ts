import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HeliaLibp2p } from 'helia';
import { CID } from 'multiformats/cid';
import { S3 } from '@aws-sdk/client-s3';

@Injectable()
export class IpfsService {
  private helia?: HeliaLibp2p;
  private fs;
  private s3: S3;
  private s3Bucket;
  private logger = new Logger(IpfsService.name);

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      region: this.configService.getOrThrow('MINIO_REGION'),
      endpoint: this.configService.getOrThrow('MINIO_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('MINIO_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow('MINIO_SECRET_KEY'),
      },
      forcePathStyle: true,
    });
    this.s3Bucket = this.configService.getOrThrow('MINIO_BUCKET_NAME');
  }

  async getHelia(): Promise<HeliaLibp2p> {
    if (this.helia == null) {
      const { S3Blockstore } = await eval('import("blockstore-s3")');
      const blockstore = new S3Blockstore(this.s3, this.s3Bucket);
      const { createHelia } = await eval('import("helia")');
      this.helia = await createHelia({ blockstore });
      this.logger.log(
        'Helia is running, PeerId ' + this.helia.libp2p.peerId.toString(),
      );
    }

    return this.helia;
  }

  async getFs() {
    if (this.fs == null) {
      const { unixfs } = await eval('import("@helia/unixfs")');
      this.fs = await unixfs(this.helia);
    }
    return this.fs;
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.helia != null) {
      await this.helia.stop();
    }
  }

  async addDoc(fileName: string, fileBuffer: Buffer) {
    await this.getHelia();
    await this.getFs();
    // console.log(fileBuffer);
    const fileObj = Object.values(fileBuffer);
    // console.log(fileObj);
    //const buffered = Buffer.from(fileObj);
    //const emptyDirCid = await this.fs.addDirectory();
    const cid = await this.fs.addFile({
      path: fileName,
      content: Uint8Array.from(fileObj),
      mode: 0x755,
    });
    //const updateDirCid = await this.fs.cp(fileCid, emptyDirCid, fileName);
    //const cid = await this.fs.addBytes(Uint8Array.from(buffered));

    // for await (const event of this.helia.libp2p.services.dht.provide(cid)) {
    //   console.log(event);
    // }

    console.log('\nAdded file:', cid);

    //await this.helia.pin.add(cid);
    //await this.helia.pin.ls();
    return cid.toString();
  }

  async getDoc(cid: CID) {
    await this.getHelia();
    await this.getFs();
    // this decoder will turn Uint8Arrays into strings
    const res = await this.fs.cat(cid);
    console.log(Object.values(res));
    for await (const buf of res) {
      console.log(buf);
    }
  }
}
