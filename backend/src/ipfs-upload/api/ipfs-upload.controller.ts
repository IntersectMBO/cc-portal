import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { IpfsUploadService } from '../services/ipfs-upload.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { HeliaLibp2p } from 'helia';
// import { HeliaDto } from '../dto/add-file-to-helia.dto';

@Controller('ipfs')
export class IpfsUploadController {
  constructor(private readonly ipfsUploadService: IpfsUploadService) {}

  @Post('helia/create')
  async setUpHeliaNode(): Promise<HeliaLibp2p> {
    return await this.ipfsUploadService.createHeliaNode();
  }

  @Post('helia/add-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async addFileToHeliaNode(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const fileBuffer = file.buffer;
    // const contentType = file.mimetype;
    return await this.ipfsUploadService.addFileToHelia(fileBuffer);
  }

  @Get('helia/get-file-content/:cid')
  async getFileContentFromCID(@Param('cid') dto: any): Promise<string> {
    return await this.ipfsUploadService.getContentFromCID(dto);
  }

  async onApplicationShutdown(): Promise<void> {
    await this.ipfsUploadService.onApplicationShutdown();
  }
}
