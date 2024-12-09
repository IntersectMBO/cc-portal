import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import {
  JOB_NAME_PRUNE_PEER_STORE,
  QUEUE_NAME_PRUNE_PEER_STORE,
} from '../../constants/bullmq.constants.js';
import { randomUUID } from 'crypto';

@Injectable()
export class PrunePeerStoreProducer {
  constructor(
    @InjectQueue(QUEUE_NAME_PRUNE_PEER_STORE) private readonly prunePeerStoreQueue: Queue,
  ) {}

  async addToQueue(inputData: string) { 
    const job = await this.prunePeerStoreQueue.add(JOB_NAME_PRUNE_PEER_STORE, inputData, {
      jobId: randomUUID(),
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 3,
      backoff: { type: 'fixed', delay: 300000 }, // 300 seconds
    });
    return job;
  }
}
