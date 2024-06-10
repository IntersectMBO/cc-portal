import { InjectFlowProducer, InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowProducer, Queue } from 'bullmq';
import {
  FLOW_NAME_EXTRACT_VOTE_DATA,
  JOB_NAME_VOTE_SYNC,
  QUEUE_NAME_DB_SYNC,
} from '../common/constants/bullmq.constants';
import { VoteService } from './services/vote.service';
import { randomUUID } from 'crypto';
import { VoteRequest } from './dto/vote.request';

@Injectable()
export class VoteProducer {
  constructor(
    @InjectQueue(QUEUE_NAME_DB_SYNC) private readonly dbSyncQueue: Queue,
    @InjectFlowProducer(FLOW_NAME_EXTRACT_VOTE_DATA)
    private readonly flowProducer: FlowProducer,
    private readonly voteService: VoteService,
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
