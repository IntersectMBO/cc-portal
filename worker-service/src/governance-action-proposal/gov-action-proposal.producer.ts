import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  JOB_NAME_GOV_ACTIONS_SYNC,
  QUEUE_NAME_DB_SYNC_GOV_ACTIONS,
} from '../common/constants/bullmq.constants';
import { randomUUID } from 'crypto';
import { GovActionProposalRequest } from './dto/gov-action-proposal.request';

@Injectable()
export class GovActionProposalProducer {
  constructor(
    @InjectQueue(QUEUE_NAME_DB_SYNC_GOV_ACTIONS)
    private readonly dbSyncQueue: Queue,
  ) {}

  async addToGovActionQueue(inputData: GovActionProposalRequest[]) {
    const job = await this.dbSyncQueue.add(
      JOB_NAME_GOV_ACTIONS_SYNC,
      inputData,
      {
        jobId: randomUUID(),
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
        backoff: { type: 'fixed', delay: 5000 },
      },
    );
    return job;
  }
}
