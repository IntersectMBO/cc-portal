import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  DB_SYNC_VOTES_TABLE_QUEUE,
  VOTES_TABLE_JOB,
} from '../common/constants.js';

@Processor(DB_SYNC_VOTES_TABLE_QUEUE, { lockDuration: 600000 })
export class VoteTableConsumer extends WorkerHost {
  constructor() {
    super();
  }
  private readonly logger = new Logger(VoteTableConsumer.name);

  async process(job: Job<any>, token: string | undefined): Promise<any> {
    switch (job.name) {
      case VOTES_TABLE_JOB: {
        this.logger.verbose(`Syncing votes table ${job.id}`);
        return job.data;
      }
    }
  }
}
