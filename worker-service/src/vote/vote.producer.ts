import { InjectFlowProducer, InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowProducer, Queue } from 'bullmq';
import {
  FLOW_NAME_EXTRACT_VOTE_DATA,
  JOB_NAME_FILTER_VOTE_DATA,
  JOB_NAME_QWERTY,
  JOB_NAME_VOTE_SYNC,
  QUEUE_NAME_DB_SYNC,
} from '../common/constants';
// import { randomUUID } from 'crypto';

@Injectable()
export class VoteProducer {
  constructor(
    @InjectQueue(QUEUE_NAME_DB_SYNC) private readonly dbSyncQueue: Queue,
    @InjectFlowProducer(FLOW_NAME_EXTRACT_VOTE_DATA)
    private readonly flowProducer: FlowProducer,
  ) {}

  // I have added a `delay` option in job `opts` so it is easier to see the sequence of jobs' executions
  async voteFlowProducer() {
    const job = await this.flowProducer.add({
      name: JOB_NAME_VOTE_SYNC,
      data: {},
      queueName: QUEUE_NAME_DB_SYNC,
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
          data: { idx: 0, foo: 'bar' },
          queueName: QUEUE_NAME_DB_SYNC,
          opts: {
            delay: 2000,
            removeOnComplete: { age: 3600, count: 5 },
            removeOnFail: { age: 24 * 3 * 3600 },
            attempts: 3,
            backoff: { type: 'fixed', delay: 5000 },
          },
          children: [
            {
              name: JOB_NAME_QWERTY,
              data: { firstName: 'Dule', age: 23 },
              queueName: QUEUE_NAME_DB_SYNC,
              opts: {
                delay: 2000,
                removeOnComplete: { age: 3600, count: 5 },
                removeOnFail: { age: 24 * 3 * 3600 },
                attempts: 3,
                backoff: { type: 'fixed', delay: 5000 },
              },
            },
          ],
        },
      ],
    });
    return job;
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
