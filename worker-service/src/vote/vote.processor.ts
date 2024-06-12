import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  JOB_NAME_VOTE_SYNC,
  QUEUE_NAME_DB_SYNC,
} from '../common/constants/bullmq.constants';
//import { WorkerHostProcessor } from 'src/common/worker-host.processor';
import { Logger } from '@nestjs/common';
import { VoteService } from './services/vote.service';

@Processor(QUEUE_NAME_DB_SYNC)
export class VoteProcessor extends WorkerHost {
  protected readonly logger = new Logger(VoteProcessor.name);
  constructor(private readonly voteService: VoteService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case JOB_NAME_VOTE_SYNC: {
        this.logger.debug('Data from db-sync');
        return job.data;
      }
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.voteService.storeVoteData(returnvalue);
    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}.`,
    );
  }
}
