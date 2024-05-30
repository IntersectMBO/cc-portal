import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import {
  QUEUE_NAME_VOTES_TABLE_SYNC,
  JOB_NAME_VOTE_PAGINATION,
} from '../../common/constants/bullmq.constants';
import { VoteService } from '../services/vote.service';

@Processor(QUEUE_NAME_VOTES_TABLE_SYNC, {
  stalledInterval: 150000,
  lockDuration: 150000,
  skipLockRenewal: true,
  lockRenewTime: 150000,
})
export class VotesTableSyncConsumer extends WorkerHost {
  constructor(private readonly voteService: VoteService) {
    super();
  }
  private readonly logger = new Logger(VotesTableSyncConsumer.name);

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case JOB_NAME_VOTE_PAGINATION:
        {
          this.logger.debug('Parent job is getting executed');
        }
        break;
    }
  }
}
//   case JOB_NAME_VOTE_SYNC:
//     {
//       this.logger.debug('Second child job is getting executed');
//       const childrenValues = await job.getChildrenValues();
//       console.log(childrenValues);
//       const votesArray = Object.values(childrenValues)[0];
//       const votesRequest: VoteRequestDto[] = votesArray.map((x) =>
//         VoteMapper.objectToVotesRequest(x),
//       );
//       const hotAddressRequest: HotAddressRequestDto[] = votesArray.map(
//         (x) => {
//           HotAddressMapper.voteRequestToHotAddressRequest(x);
//         },
//       );

//       const savedVotes =
//         await this.voteService.storeVotesData(votesRequest);
//       const savedHotAddresses =
//         await this.hotAddressService.storeHotAddressData(hotAddressRequest);
//       // const respVotes = this.logger.verbose(savedVotes);
//       const respHotAddresses = this.logger.debug(savedHotAddresses);
//       return respHotAddresses;
//     }
//     break;
//   case JOB_NAME_FILTER_VOTE_DATA:
//     {
//       this.logger.debug('First child job is getting executed');
//       const filePath = path.join(
//         __dirname,
//         '../sql',
//         'moj-get-votes-test.sql',
//       );
//       const voteData = await this.voteService.getVotesFromSqlFile(
//         filePath,
//         ['555-333'],
//         // [],
//       );
//       job.data = voteData;
//       return job.data;
//     }
//     break;
// }
