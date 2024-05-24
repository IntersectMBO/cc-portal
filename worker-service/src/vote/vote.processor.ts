import { OnWorkerEvent, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  JOB_NAME_FILTER_VOTE_DATA,
  JOB_NAME_QWERTY,
  JOB_NAME_VOTE_SYNC,
  QUEUE_NAME_DB_SYNC,
} from '../common/constants';
import { WorkerHostProcessor } from 'src/common/worker-host.processor';
import { Logger } from '@nestjs/common';

@Processor(QUEUE_NAME_DB_SYNC)
export class VoteProcessor extends WorkerHostProcessor {
  protected readonly logger = new Logger(VoteProcessor.name);

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case JOB_NAME_VOTE_SYNC: {
        this.logger.debug('Parent job is getting executed');
        const qwe = this.logger.verbose(await job.getChildrenValues());
        return qwe;
      }
      case JOB_NAME_FILTER_VOTE_DATA: {
        this.logger.debug('Second child job is getting executed');
        return job.data;
      }
      case JOB_NAME_QWERTY: {
        this.logger.debug('First child job is getting executed');
        return job.data;
      }
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    // this.processData(returnvalue);
    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}. Result: ${returnvalue}`,
    );
  }

  async processData(data): Promise<void> {
    data.forEach((element) => {
      console.log(element);
    });
  }
}
