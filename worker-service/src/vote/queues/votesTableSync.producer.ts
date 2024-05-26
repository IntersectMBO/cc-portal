import { FlowProducer, Queue } from 'bullmq';
import {
  JOB_NAME_VOTE_SYNC,
  QUEUE_NAME_VOTES_TABLE_SYNC,
  JOB_NAME_FILTER_VOTE_DATA,
  FLOW_NAME_EXTRACT_VOTE_DATA,
} from '../../common/constants';
import { InjectQueue, InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VotesTableSyncProducer {
  constructor(
    @InjectQueue(QUEUE_NAME_VOTES_TABLE_SYNC)
    private readonly votesTableSyncQueue: Queue,
    @InjectFlowProducer(FLOW_NAME_EXTRACT_VOTE_DATA)
    private readonly extractVoteDataFlow: FlowProducer,
  ) {}

  // I have added a `delay` option in job `opts` so it is easier to see the sequence of jobs' executions
  async syncVotesTable() {
    await this.votesTableSyncQueue.clean(0, 1000, 'delayed');
    await this.votesTableSyncQueue.clean(0, 1000, 'wait');
    await this.extractVoteDataFlow.add({
      name: JOB_NAME_VOTE_SYNC,
      data: {},
      queueName: QUEUE_NAME_VOTES_TABLE_SYNC,
      opts: {
        delay: 2000,
        removeOnComplete: { age: 3600, count: 5 },
        removeOnFail: { age: 24 * 3 * 3600 },
        attempts: 3,
        backoff: { type: 'fixed', delay: 5000 },
      },
      children: [
        {
          name: JOB_NAME_FILTER_VOTE_DATA,
          data: {},
          queueName: QUEUE_NAME_VOTES_TABLE_SYNC,
          opts: {
            delay: 2000,
            removeOnComplete: { age: 3600, count: 5 },
            removeOnFail: { age: 24 * 3 * 3600 },
            attempts: 3,
            backoff: { type: 'fixed', delay: 5000 },
          },
          // children: [
          //   {
          //     name: JOB_NAME_QWERTY,
          //     data: { firstName: 'Dule', age: 23 },
          //     queueName: QUEUE_NAME_VOTES_TABLE_SYNC,
          //     opts: {
          //       removeOnComplete: { age: 3600, count: 5 },
          //       removeOnFail: { age: 24 * 3 * 3600 },
          //       attempts: 3,
          //       backoff: { type: 'fixed', delay: 5000 },
          //     },
          //   },
          // ],
        },
      ],
    });
    // return job;
  }

  // async voteProducer(inputData: object[]) {
  //   const job = await this.dbSyncQueue.add(JOB_NAME_VOTE_SYNC, inputData, {
  //     jobId: randomUUID(),
  //     removeOnComplete: { age: 3600, count: 5 },
  //     removeOnFail: { age: 24 * 3 * 3600 },
  //     attempts: 3,
  //     backoff: { type: 'fixed', delay: 5000 },
  //   });
  //   return job;
  // }

  // async filterVoteDataProducer(inputData: object[]) {
  //   const job = await this.dbSyncQueue.add(
  //     JOB_NAME_FILTER_VOTE_DATA,
  //     inputData,
  //     {
  //       jobId: randomUUID(),
  //       removeOnComplete: { age: 3600, count: 5 },
  //       removeOnFail: { age: 24 * 3 * 3600 },
  //       attempts: 3,
  //       backoff: { type: 'fixed', delay: 5000 },
  //     },
  //   );
  // }
}
