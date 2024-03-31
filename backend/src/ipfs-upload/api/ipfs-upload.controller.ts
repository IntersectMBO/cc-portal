import { Body, Controller, Get, Post } from '@nestjs/common';
import { IpfsUploadService } from '../services/ipfs-upload.service';
import { HeliaLibp2p } from 'helia';
import { HeliaDto } from '../dto/add-file-to-helia.dto';

@Controller('ipfs')
export class IpfsUploadController {
  constructor(private readonly ipfsUploadService: IpfsUploadService) {}

  @Post('helia/create')
  async setUpHeliaNode(): Promise<HeliaLibp2p> {
    return await this.ipfsUploadService.createHeliaNode();
  }

  @Post('helia/add-file')
  async addFileToHeliaNode(@Body() dto: HeliaDto): Promise<void> {
    return await this.ipfsUploadService.addFileToHeliaNode(dto);
  }
  @Get('helia/get-file-content')
  async getFileContentFromCID(@Body() dto: HeliaDto): Promise<string> {
    return await this.ipfsUploadService.getFileContent(dto);
  }

  async onApplicationShutdown(): Promise<void> {
    await this.ipfsUploadService.onApplicationShutdown();
  }
}
