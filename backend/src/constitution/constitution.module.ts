import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { ConstitutionController } from './api/constitution.controller';
import { ConstitutionFacade } from './facade/constitution.facade';
import { ConstitutionService } from './services/constitution.service';
import { IpfsUploadService } from '../ipfs-upload/services/ipfs-upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ipfs } from '../ipfs-upload/entities/ipfs.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([Ipfs])],
  controllers: [ConstitutionController],
  providers: [
    ConstitutionFacade,
    ConstitutionService,
    IpfsUploadService,
    TextDecoder,
    Repository,
  ],
  exports: [],
})
export class ConstitutionModule {}
