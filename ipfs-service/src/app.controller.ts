import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { IpfsDto } from './dto/ipfs.dto.js';
import { ApiKeyGuard } from './guards/api-key.guard.js';

// Upper bound for uploaded files; the backend accepts up to 5 MB.
const MAX_UPLOAD_FILE_SIZE = 10 * 1024 * 1024;

@Controller('ipfs')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  async onApplicationShutdown(): Promise<void> {
    await this.appService.onApplicationShutdown();
  }

  @UseGuards(ApiKeyGuard)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_UPLOAD_FILE_SIZE } }),
  )
  @Post('file')
  async addFile(@UploadedFile() file: Express.Multer.File): Promise<IpfsDto> {
    return await this.appService.addFile(file);
  }

  @UseGuards(ApiKeyGuard)
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
