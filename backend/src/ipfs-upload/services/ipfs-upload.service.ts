import { Injectable, NotFoundException } from '@nestjs/common';
import { UnixFS } from '@helia/unixfs';
import { TextDecoder } from 'util';
import { HeliaLibp2p } from 'helia';
import { importDynamic } from '../../util/import.dynamic';
import { Repository } from 'typeorm';
import { Ipfs } from '../entities/ipfs.entity';
import { InjectRepository } from '@nestjs/typeorm';

// import { HeliaDto } from '../dto/add-file-to-helia.dto';

@Injectable()
export class IpfsUploadService {
  private helia: HeliaLibp2p;
  private fs: UnixFS;
  constructor(
    private readonly textDecoder: TextDecoder,
    @InjectRepository(Ipfs)
    private readonly ipfsRepository: Repository<Ipfs>,
  ) {}

  async addFileToHelia(fileBuffer: Buffer): Promise<void> {
    await this.createHeliaNode();
    const fileObj = Object.values(fileBuffer);

    const cid = await this.fs.addFile({ content: Uint8Array.from(fileObj) });
    console.log('Added file:', cid.toString());
  }

  async getFileContentsFromCID(cid: string): Promise<string> {
    const { CID } = await importDynamic('multiformats/cid');

    await this.createHeliaNode();
    let text: string = '';

    for await (const chunk of this.fs.cat(CID.parse(cid))) {
      text += this.textDecoder.decode(chunk, { stream: true });
    }
    return text;
  }

  async findByCID(cid: string) {
    const file = await this.ipfsRepository.findOne({
      where: {
        cid: cid,
      },
    });
    if (!file) {
      throw new NotFoundException(`File with CID '${cid}' not found`);
    }
    return file;
  }
  //-------------------------------

  private async createHeliaNode(): Promise<HeliaLibp2p> {
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

  private async createDatastore() {
    const { LevelDatastore } = await importDynamic('datastore-level');
    const datastore = await new LevelDatastore('.ipfs/datastore');
    return datastore;
  }

  private async createBlockstore() {
    const { FsBlockstore } = await importDynamic('blockstore-fs');
    const blockstore = await new FsBlockstore('.ipfs/blockstore');
    return blockstore;
  }

  // private async onApplicationShutdown(): Promise<void> {
  //   if (this.helia != null) {
  //     await this.helia.stop();
  //   }
  // }
}
