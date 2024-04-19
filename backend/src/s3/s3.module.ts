import { Module } from '@nestjs/common';
import { S3Service } from './service/s3.service';
import { s3ClientFactory } from './client/s3client';

@Module({
  providers: [s3ClientFactory, S3Service],
  exports: [S3Service],
})
export class S3Module {}
