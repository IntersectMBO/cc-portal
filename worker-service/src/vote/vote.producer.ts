import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { JOB_NAME_VOTE_SYNC, QUEUE_NAME_DB_SYNC } from '../common/constants';
import { randomUUID } from 'crypto';

@Injectable()
export class VoteProducer {
  constructor(
    @InjectQueue(QUEUE_NAME_DB_SYNC) private readonly dbSyncQueue: Queue,
  ) {}

  async voteProducer(inputData: object[]) {
    const job = await this.dbSyncQueue.add(JOB_NAME_VOTE_SYNC, inputData, {
      jobId: randomUUID(),
      removeOnComplete: { age: 3600, count: 5 },
      removeOnFail: { age: 24 * 3 * 3600 },
      attempts: 3,
      backoff: { type: 'fixed', delay: 5000 },
    });
    return job;
  }
}
