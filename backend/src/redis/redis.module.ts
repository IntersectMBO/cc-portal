import { Module } from '@nestjs/common';
import { RedisRepository } from './repository/redis.repo';
import { redisClientFactory } from './client/redis-client';
import { ConstitutionRedisService } from './service/constitution-redis.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RedisRepository, redisClientFactory, ConstitutionRedisService],
  exports: [ConstitutionRedisService],
})
export class RedisModule {}
