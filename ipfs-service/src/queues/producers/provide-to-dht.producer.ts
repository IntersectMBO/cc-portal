import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import {
  JOB_NAME_PROVIDE_TO_DHT,
  QUEUE_NAME_PROVIDE_TO_DHT,
} from '../../constants/bullmq.constants.js';
import { randomUUID } from 'crypto';

@Injectable()
export class ProvideToDHTProducer {
  constructor(
    @InjectQueue(QUEUE_NAME_PROVIDE_TO_DHT) private readonly provideToDHTQueue: Queue,
    private readonly configService: ConfigService
  ) {}

  async addToQueue(inputData: string) { 
    const job = await this.provideToDHTQueue.add(JOB_NAME_PROVIDE_TO_DHT, inputData, {
      jobId: randomUUID(),
      removeOnComplete: true,
      removeOnFail: false,
      attempts: this.configService.getOrThrow('DHT_QUEUE_ATTEMPTS'),
      backoff: { 
        type: this.configService.getOrThrow('DHT_QUEUE_BACKOFF_TYPE'),
        delay: this.configService.getOrThrow('DHT_QUEUE_BACKOFF_DELAY') },
    });
    return job;
  }
}
