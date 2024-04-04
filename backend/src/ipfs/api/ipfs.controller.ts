import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IpfsService } from '../services/ipfs.service';

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Get('helia')
  async getHeliaVersion(): Promise<string> {
    const helia = await this.ipfsService.getHelia();
    return 'Helia is running, PeerId ' + helia.libp2p.peerId.toString();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.ipfsService.onApplicationShutdown();
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async addDoc(@UploadedFile() file: Express.Multer.File) {
    return await this.ipfsService.addDoc(file.originalname, file.buffer);
    //return await this.ipfsService.uploadFile(file);
  }

  @Get(':cid')
  async getDoc(@Param() cid) {
    return await this.ipfsService.getDoc(cid);
  }
}
