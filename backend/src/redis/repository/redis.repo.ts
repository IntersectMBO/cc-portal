import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { IHashSetRedisDTO } from '../util/hashset-redis-dto-interface';

@Injectable()
export class RedisRepository implements OnModuleDestroy {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async get(prefix: string, key: string): Promise<string | null> {
    return this.redisClient.get(`${prefix}:${key}`);
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value);
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
  }

  async hsetMultiple(
    prefix: string,
    values: Map<string, IHashSetRedisDTO>,
  ): Promise<void> {
    const updatedKeysWithPrefix = new Map(
      Array.from(values, ([k, v]) => [`${prefix}:${k}`, v]),
    );
    const setCommands = [];
    updatedKeysWithPrefix.forEach((v, k) => {
      setCommands.push(['hset', `${k}`, v.getHashSetValues()]);
    });

    await this.redisClient.multi(setCommands).exec();
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }

  async dropIndex(indexName: string): Promise<void> {
    const exists = await this.indexExists(indexName);
    if (exists) {
      await this.redisClient.call('FT.DROPINDEX', indexName);
    }
  }

  async indexExists(indexName: string): Promise<boolean> {
    const indices = await this.redisClient.call('FT._LIST');
    return (indices as string[]).includes(indexName);
  }

  async call(
    ...args: [command: string, ...args: (string | Buffer | number)[]]
  ): Promise<any> {
    return await this.redisClient.call(...args);
  }
}
