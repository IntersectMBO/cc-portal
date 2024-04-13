import { Module } from '@nestjs/common';
import { IpfsUploadService } from './services/ipfs-upload.service.js';
import { IpfsUploadController } from './api/ipfs-upload.controller';

@Module({
  imports: [],
  controllers: [IpfsUploadController],
  providers: [IpfsUploadService, TextEncoder, TextDecoder],
})
export class IpfsUploadModule {}
