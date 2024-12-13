import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  JOB_NAME_VOTE_SYNC,
  QUEUE_NAME_DB_SYNC_VOTES,
} from '../../../common/constants/bullmq.constants';
import { Logger } from '@nestjs/common';
import { VoteService } from '../../services/vote.service';
import { VoteRequest } from 'src/governance/dto/vote.request';

@Processor(QUEUE_NAME_DB_SYNC_VOTES)
export class VoteProcessor extends WorkerHost {
  protected readonly logger = new Logger(VoteProcessor.name);
  constructor(private readonly voteService: VoteService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case JOB_NAME_VOTE_SYNC: {
        try {
          const voteRequests: VoteRequest[] = job.data;
          const addresses = voteRequests.map(
            (voteRequest) => voteRequest.hotAddress,
          );
          this.logger.debug(
            `Processing votes for addresses:, ${JSON.stringify(addresses)}`,
          );
          await this.voteService.storeVoteData(voteRequests);
        } catch (error) {
          this.logger.error(
            `Error processing job id: ${job.id}, name: ${job.name}. - Error: ${error}`,
          );
          throw error;
        }
      }
    }
  }
}
