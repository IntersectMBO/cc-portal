import { Injectable } from '@nestjs/common';
import { UnixFS } from '@helia/unixfs';
import { TextDecoder } from 'util';
import { HeliaLibp2p } from 'helia';
import { importDynamic } from '../../util/import.dynamic';
// import { HeliaDto } from '../dto/add-file-to-helia.dto';

@Injectable()
export class IpfsUploadService {
  private helia: HeliaLibp2p;
  private fs: UnixFS;
  constructor(private readonly textDecoder: TextDecoder) {}

  async addFileToHelia(fileBuffer: Buffer): Promise<void> {
    await this.createHeliaNode();
    const fileObj = Object.values(fileBuffer);

    const cid = await this.fs.addFile({ content: Uint8Array.from(fileObj) });
    console.log('Added file:', cid.toString());
  }

  async getContentFromCID(dto: string): Promise<string> {
    const { CID } = await importDynamic('multiformats/cid');

    await this.createHeliaNode();
    let text: string = '';

    for await (const chunk of this.fs.cat(CID.parse(dto))) {
      text += this.textDecoder.decode(chunk, { stream: true });
    }
    return text;
  }
  //-------------------------------

  async createHeliaNode(): Promise<HeliaLibp2p> {
    if (this.helia == null) {
      const { createHelia } = await importDynamic('helia');
      this.helia = await createHelia({
        blockstore: await this.createBlockstore(),
        dataStore: await this.createDatastore(),
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
    const { LevelDatastore } = await importDynamic('datastore-level');
    const datastore = await new LevelDatastore('.ipfs/datastore');
    return datastore;
  }

  async createBlockstore() {
    const { FsBlockstore } = await importDynamic('blockstore-fs');
    const blockstore = await new FsBlockstore('.ipfs/blockstore');
    return blockstore;
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.helia != null) {
      await this.helia.stop();
    }
  }
}
