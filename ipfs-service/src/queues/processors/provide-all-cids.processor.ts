import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  JOB_NAME_PROVIDE_ALL_CIDS,
  QUEUE_NAME_PROVIDE_ALL_CIDS,
} from '../../constants/bullmq.constants.js';
import { Logger } from '@nestjs/common';
import { AppService } from '../../app.service.js';

@Processor(QUEUE_NAME_PROVIDE_ALL_CIDS)
export class ProvideAllCidsProcessor extends WorkerHost {
  protected readonly logger = new Logger(ProvideAllCidsProcessor.name);
  constructor(private readonly appService: AppService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case JOB_NAME_PROVIDE_ALL_CIDS: {
        try {
          this.logger.debug(
            `Processing CIDs - amount of CIDs to be processed, ${job.data?.length}`,
          );
          await this.appService.provideCidsToDHTViaQueue(job.data);
        } catch (error) {
          this.logger.error(
            `Error processing job id: ${job.id}, name: ${job.name}. - Error: ${error}`,
          );
          throw error;
        }
      }
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.logger.log(
      `Job Finished - id: ${id}, name: ${name} in queue ${queueName} on ${completionTime}.`,
    );
  }
}
