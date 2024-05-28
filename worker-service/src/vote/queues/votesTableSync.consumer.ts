import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import {
  QUEUE_NAME_VOTES_TABLE_SYNC,
  JOB_NAME_VOTE_SYNC,
  JOB_NAME_FILTER_VOTE_DATA,
} from '../../common/constants/bullmq.constants';
import { VoteService } from '../services/vote.service';
import * as path from 'path';
import { VoteMapper } from '../mapper/vote.mapper';
import { VoteRequestDto } from '../dto/vote-request.dto';

@Processor(QUEUE_NAME_VOTES_TABLE_SYNC)
export class VotesTableSyncConsumer extends WorkerHost {
  constructor(private readonly voteService: VoteService) {
    super();
  }
  private readonly logger = new Logger(VotesTableSyncConsumer.name);

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case JOB_NAME_VOTE_SYNC:
        {
          this.logger.debug('Parent job is getting executed');
          const childrenValues = await job.getChildrenValues();
          const votesArray = Object.values(childrenValues)[0];
          const votesRequest: VoteRequestDto[] = votesArray.map((x) =>
            VoteMapper.objectToVotesRequest(x),
          );
          const saved = await this.voteService.storeVotesData(votesRequest);
          const resp = this.logger.verbose(saved);
          return resp;
        }
        break;
      case JOB_NAME_FILTER_VOTE_DATA:
        {
          this.logger.debug('First child job is getting executed');
          const filePath = path.join(
            __dirname,
            '../sql',
            'moj-get-votes-test.sql',
          );
          const voteData = await this.voteService.getVotesFromSqlFile(
            filePath,
            ['555-333'],
          );
          job.data = voteData;
          return job.data;
        }
        break;
    }
  }
}
