import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { ConstitutionController } from './api/constitution.controller';
import { ConstitutionFacade } from './facade/constitution.facade';

@Module({
  imports: [RedisModule],
  controllers: [ConstitutionController],
  providers: [ConstitutionFacade],
  exports: [],
})
export class ConstitutionModule {}
