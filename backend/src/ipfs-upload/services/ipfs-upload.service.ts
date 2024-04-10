import { Injectable } from '@nestjs/common';
import { UnixFS } from '@helia/unixfs';
import { TextDecoder } from 'util';
import { HeliaLibp2p } from 'helia';
import { S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { importDynamic } from '../../util/import.dynamic';

// import { HeliaDto } from '../dto/add-file-to-helia.dto';

@Injectable()
export class IpfsUploadService {
  private helia: HeliaLibp2p;
  private fs: UnixFS;
  private s3: S3;
  constructor(
    private readonly textDecoder: TextDecoder,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3({
      region: this.configService.getOrThrow('MINIO_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('MINIO_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow('MINIO_SECRET_KEY'),
      },
    });
  }

  async addFileToHeliaNode(fileBuffer: Buffer): Promise<void> {
    await this.createHeliaNode();
    const fileObj = Object.values(fileBuffer);

    const cid = await this.fs.addFile({ content: Uint8Array.from(fileObj) });
    console.log('Added file:', cid.toString());
  }

  async getFileContentFromCID(dto: string): Promise<string> {
    const { CID } = await importDynamic('multiformats/cid');

    await this.createHeliaNode();
    let text: string = '';

    for await (const chunk of this.fs.cat(CID.parse(dto))) {
      text += this.textDecoder.decode(chunk, { stream: true });
    }
    return text;
  }
  //-------------------------------

  private async createHeliaNode(): Promise<HeliaLibp2p> {
    if (this.helia == null) {
      const { createHelia } = await importDynamic('helia');
      this.helia = await createHelia({
        blockstore: this.createBlockstore(),
        dataStore: this.createDatastore(),
      });
      console.log(
        'Helia is running, PeerId: ' + this.helia.libp2p.peerId.toString(),
      );
      await this.createUnixFs();
    }
    return this.helia;
  }

  private async createUnixFs(): Promise<UnixFS> {
    const { unixfs } = await importDynamic('@helia/unixfs');
    this.fs = unixfs(this.helia);
    console.log('UnixFS is set up on top of Helia node ');
    return this.fs;
  }

  async createDatastore() {
    const { S3Datastore } = await importDynamic('datastore-s3');
    const datastore = new S3Datastore(
      this.s3,
      this.configService.getOrThrow('MINIO_BUCKET'),
    );
    return datastore;
  }

  async createBlockstore() {
    const { S3Blockstore } = await importDynamic('blockstore-s3');
    const blockstore = new S3Blockstore(
      this.s3,
      this.configService.getOrThrow('MINIO_BUCKET'),
    );
    return blockstore;
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.helia != null) {
      await this.helia.stop();
    }
  }
}
