import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  JOB_NAME_PROVIDE_ALL_CIDS,
  QUEUE_NAME_PROVIDE_ALL_CIDS,
} from '../../constants/bullmq.constants.js';
import { randomUUID } from 'crypto';

@Injectable()
export class ProvideAllCidsProducer {
  constructor(
    @InjectQueue(QUEUE_NAME_PROVIDE_ALL_CIDS)
    private readonly provideAllCidsQueue: Queue,
  ) {}

  async addToQueue(inputData: string[]) {
    const job = await this.provideAllCidsQueue.add(
      JOB_NAME_PROVIDE_ALL_CIDS,
      inputData,
      {
        jobId: randomUUID(),
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 60000, // 60 seconds
        },
      },
    );
    return job;
  }
}
