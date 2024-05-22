import { OnWorkerEvent, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JOB_NAME_VOTE_SYNC, QUEUE_NAME_DB_SYNC } from '../common/constants';
import { WorkerHostProcessor } from 'src/common/worker-host.processor';
import { Logger } from '@nestjs/common';

@Processor(QUEUE_NAME_DB_SYNC)
export class VoteProcessor extends WorkerHostProcessor {
  protected readonly logger = new Logger(VoteProcessor.name);

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case JOB_NAME_VOTE_SYNC: {
        return job.data;
      }
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.processData(returnvalue);
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
