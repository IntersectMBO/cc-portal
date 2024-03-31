import { Injectable } from '@nestjs/common';
import { UnixFS } from '@helia/unixfs';
import { TextEncoder, TextDecoder } from 'util';
import { HeliaLibp2p } from 'helia';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { HeliaDto } from '../dto/add-file-to-helia.dto';

@Injectable()
export class IpfsUploadService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly textEncoder: TextEncoder,
    private readonly textDecoder: TextDecoder,
  ) {}
  private helia: HeliaLibp2p;
  private fs: UnixFS;

  async createHeliaNode(): Promise<HeliaLibp2p> {
    if (this.helia == null) {
      const { createHelia } = await eval('import("helia")');
      this.helia = await createHelia();
      this.eventEmitter.emit('unixfs.created', this.createUnixFs());
    }
    console.log(
      'Helia is running, PeerId: ' + this.helia.libp2p.peerId.toString(),
    );
    return this.helia;
  }
  @OnEvent('unixfs.created')
  private async createUnixFs(): Promise<UnixFS> {
    const { unixfs } = await eval('import("@helia/unixfs")');
    this.fs = unixfs(this.helia);
    console.log('UnixFS is set up on top of Helia node ');
    return this.fs;
  }
  //-------------------------------

  addFileToHeliaNode = async (dto: HeliaDto): Promise<void> => {
    const bytes = this.textEncoder.encode(dto.fileContent);
    const cid = await this.fs.addBytes(bytes);
    return console.log('Added file:', cid.toString());
  };

  async getFileContent(dto: HeliaDto): Promise<string> {
    let text: string = '';

    for await (const chunk of this.fs.cat(dto.cid)) {
      text += this.textDecoder.decode(chunk, { stream: true });
    }

    return text;
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.helia != null) {
      await this.helia.stop();
    }
  }
}
