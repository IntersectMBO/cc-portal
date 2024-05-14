import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import {
  DB_SYNC_VOTES_TABLE_QUEUE,
  VOTES_TABLE_JOB,
} from '../common/constants.js';
import { randomUUID } from 'crypto';

@Injectable()
export class VoteProducer {
  constructor(
    @InjectQueue(DB_SYNC_VOTES_TABLE_QUEUE)
    private readonly dbSyncVotesTableQueue: Queue,
  ) {}

  async votesTableProducer(dummyData: Object) {
    const job = await this.dbSyncVotesTableQueue.add(
      VOTES_TABLE_JOB,
      dummyData,
      {
        jobId: randomUUID(),
        // repeat: {
        //   every: 5000,
        //   tz: 'Europe/Belgrade',
        // },
        removeOnComplete: { age: 3600, count: 5 },
        removeOnFail: { age: 24 * 3 * 3600 },
        attempts: 3,
        backoff: { type: 'fixed', delay: 5000 },
      },
    );
    return job;
  }
}
