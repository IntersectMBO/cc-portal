import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { ConstitutionController } from './api/constitution.controller';
import { ConstitutionFacade } from './facade/constitution.facade';
import { ConstitutionService } from './services/constitution.service';
import { Repository } from 'typeorm';
import { IpfsModule } from 'src/ipfs/ipfs.module';

@Module({
  imports: [IpfsModule, RedisModule],
  controllers: [ConstitutionController],
  providers: [
    ConstitutionFacade,
    ConstitutionService,
    ,
    TextDecoder,
    Repository,
  ],
  exports: [],
})
export class ConstitutionModule {}
