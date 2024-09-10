import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  JOB_NAME_PROVIDE_TO_DHT,
  QUEUE_NAME_PROVIDE_TO_DHT,
} from '../../constants/bullmq.constants.js';
import { Logger } from '@nestjs/common';
import { AppService } from '../../app.service.js';
import { CID } from 'multiformats/cid';

@Processor(QUEUE_NAME_PROVIDE_TO_DHT)
export class ProvideToDHTProcessor extends WorkerHost {
  protected readonly logger = new Logger(ProvideToDHTProcessor.name);
  constructor(private readonly appService: AppService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case JOB_NAME_PROVIDE_TO_DHT: {
        const cid = CID.parse(job.data);
        this.logger.debug('Job triggered: Provide to DHT - CID:', cid.toString());
        try {
          await this.appService.provideCidtoDHTViaQueue(cid);
        } catch (error) {
          this.logger.error(`Error processing job id: ${job.id}, name: ${job.name}. - Error: ${error}`);
          throw error;
        } 
      }
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.logger.log(
      `Job Finished - id: ${id}, name: ${name} in queue ${queueName} on ${completionTime}.`,);
  }
}
