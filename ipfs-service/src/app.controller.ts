import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { IpfsDto } from './dto/ipfs.dto.js';

@Controller('ipfs')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  async onApplicationShutdown(): Promise<void> {
    await this.appService.onApplicationShutdown();
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  async addFile(@UploadedFile() file: Express.Multer.File): Promise<IpfsDto> {
    return await this.appService.addFile(file);
  }

  @Post('json')
  async addJson(@Body() json: string): Promise<IpfsDto> {
    return await this.appService.addJson(json);
  }

  @Get(':cid')
  async getDoc(@Param('cid') cid: string): Promise<IpfsDto> {
    const doc = await this.appService.getDocByCid(cid);
    if (!doc) {
      throw new NotFoundException(`Document with cid: ${cid} not found`);
    }
    return doc;
  }

  @Get('ipns/url')
  async getIpnsUrl(): Promise<string> {
    return await this.appService.getIpnsUrl();
  }
}
