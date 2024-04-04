import { Injectable } from '@nestjs/common';
import { UnixFS } from '@helia/unixfs';
import { TextDecoder } from 'util';
import { HeliaLibp2p } from 'helia';
// import { HeliaDto } from '../dto/add-file-to-helia.dto';
import { CID } from 'multiformats/cid';
import multibase = require('multibase');

// const dynamic = new Function('modulePath', 'return import(modulePath)');
@Injectable()
export class IpfsUploadService {
  constructor(private readonly textDecoder: TextDecoder) {}
  private helia: HeliaLibp2p;
  private fs: UnixFS;

  async addFileToHeliaNode(fileBuffer: Buffer): Promise<void> {
    await this.createHeliaNode();
    const fileObj = Object.values(fileBuffer);

    const cid = await this.fs.addFile({ content: Uint8Array.from(fileObj) });
    console.log('Added file:', cid.toString());
  }

  async getFileContentFromCID(dto: string): Promise<string> {
    const { CID } = await eval('import("multiformats/cid")');

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
      const { FsBlockstore } = await eval('import("blockstore-fs")');
      const { MemoryDatastore } = await eval('import("datastore-core")');
      const { createHelia } = await eval('import("helia")');
      const blockStore = new FsBlockstore('../blockstore');
      const dataStore = new MemoryDatastore();
      this.helia = await createHelia({
        blockstore: blockStore,
        dataStore: dataStore,
      });
      console.log(
        'Helia is running, PeerId: ' + this.helia.libp2p.peerId.toString(),
      );
      await this.createUnixFs();
    }
    return this.helia;
  }
  private async createUnixFs(): Promise<UnixFS> {
    const { unixfs } = await eval('import("@helia/unixfs")');
    this.fs = unixfs(this.helia);
    console.log('UnixFS is set up on top of Helia node ');
    return this.fs;
  }
  async onApplicationShutdown(): Promise<void> {
    if (this.helia != null) {
      await this.helia.stop();
    }
  }
}
