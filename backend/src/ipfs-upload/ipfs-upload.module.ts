import { Module } from '@nestjs/common';
import { IpfsUploadService } from './services/ipfs-upload.service.js';
import { IpfsUploadController } from './api/ipfs-upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ipfs } from './entities/ipfs.entity.js';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Ipfs])],
  controllers: [IpfsUploadController],
  providers: [IpfsUploadService, TextDecoder, Repository],
})
export class IpfsUploadModule {}
