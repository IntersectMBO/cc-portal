import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  JOB_NAME_VOTE_SYNC,
  QUEUE_NAME_DB_SYNC_VOTES,
} from '../../../common/constants/bullmq.constants';
import { randomUUID } from 'crypto';
import { VoteRequest } from '../../dto/vote.request';

@Injectable()
export class VoteProducer {
  constructor(
    @InjectQueue(QUEUE_NAME_DB_SYNC_VOTES) private readonly dbSyncQueue: Queue,
  ) {}

  async addToVoteQueue(inputData: VoteRequest[]) {
    const job = await this.dbSyncQueue.add(JOB_NAME_VOTE_SYNC, inputData, {
      jobId: randomUUID(),
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 3,
      backoff: { type: 'fixed', delay: 5000 },
    });
    return job;
  }
}
