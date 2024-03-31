import { Module } from '@nestjs/common';
import { IpfsUploadService } from './services/ipfs-upload.service.js';
import { IpfsUploadController } from './api/ipfs-upload.controller';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [],
  controllers: [IpfsUploadController],
  providers: [IpfsUploadService, EventEmitter2, TextEncoder, TextDecoder],
})
export class IpfsUploadModule {}
