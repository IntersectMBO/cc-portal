import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { ConstitutionController } from './api/constitution.controller';
import { ConstitutionFacade } from './facade/constitution.facade';
import { IpfsModule } from 'src/ipfs/ipfs.module';

@Module({
  imports: [RedisModule, IpfsModule],
  controllers: [ConstitutionController],
  providers: [ConstitutionFacade],
  exports: [],
})
export class ConstitutionModule {}
