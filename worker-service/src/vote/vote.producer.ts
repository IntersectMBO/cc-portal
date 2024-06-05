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

  // I have added a `delay` option in job `opts` so it is easier to see the sequence of jobs' executions
  // async voteFlowProducer(hotAddresses: string[]) {
  //   const job = await this.flowProducer.add({
  //     name: JOB_NAME_VOTE_SYNC,
  //     data: { name: 'Parent', surname: 'Job' },
  //     queueName: QUEUE_NAME_DB_SYNC,
  //     opts: {
  //       delay: 3000,
  //       removeOnComplete: { age: 3600, count: 5 },
  //       removeOnFail: { age: 24 * 3 * 3600 },
  //       attempts: 3,
  //       backoff: { type: 'fixed', delay: 5000 },
  //     },
  //     children: [
  //       {
  //         name: JOB_NAME_FILTER_DATA,
  //         data: await this.voteService.getVoteDataFromDbSync(hotAddresses),
  //         queueName: QUEUE_NAME_DB_SYNC,
  //         opts: {
  //           delay: 3000,
  //           removeOnComplete: { age: 3600, count: 5 },
  //           removeOnFail: { age: 24 * 3 * 3600 },
  //           attempts: 3,
  //           backoff: { type: 'fixed', delay: 5000 },
  //         },
  //       },
  //     ],
  //   });
  //   return job;
  // }

  async addToVoteQueue(inputData: VoteRequest[]) {
    const job = await this.dbSyncQueue.add(JOB_NAME_VOTE_SYNC, inputData, {
      jobId: randomUUID(),
      // repeat: {
      //   pattern: '*/15 * * * * *',
      // },
      delay: 3000,
      removeOnComplete: { age: 30, count: 5 },
      removeOnFail: { age: 24 * 3 * 3600 },
      attempts: 3,
      backoff: { type: 'fixed', delay: 5000 },
    });
    return job;
  }
}
