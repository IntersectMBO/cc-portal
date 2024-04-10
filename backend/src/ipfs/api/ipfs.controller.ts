import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IpfsFacade } from '../facade/ipfs.facade';
import { UploadResponse } from './response/upload.response';
import { DocResponse } from './response/doc.response';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsFacade: IpfsFacade) {}

  @Get('helia')
  async getHeliaVersion(): Promise<string> {
    const helia = await this.ipfsFacade.getHelia();
    return 'Helia is running, PeerId ' + helia.libp2p.peerId.toString();
  }

  // async onApplicationShutdown(): Promise<void> {
  //   await this.ipfsService.onApplicationShutdown();
  // }

  @ApiOperation({ summary: 'Upload CC document' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Document uploaded successfully.',
    type: UploadResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 409,
    description: 'Document already uploaded',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async addDoc(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponse> {
    return await this.ipfsFacade.addDoc(file);
  }

  @ApiOperation({ summary: 'Find document by cid' })
  @ApiResponse({
    status: 200,
    description: 'The user details',
    type: DocResponse,
  })
  @ApiResponse({ status: 404, description: 'User with {id} not found' })
  @Get(':cid')
  async findDoc(@Param('cid') cid): Promise<DocResponse> {
    return await this.ipfsFacade.findDoc(cid);
  }
}
