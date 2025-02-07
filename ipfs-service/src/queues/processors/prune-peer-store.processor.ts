import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  JOB_NAME_PRUNE_PEER_STORE,
  QUEUE_NAME_PRUNE_PEER_STORE,
} from '../../constants/bullmq.constants.js';
import { Logger } from '@nestjs/common';
import { AppService } from '../../app.service.js';

@Processor(QUEUE_NAME_PRUNE_PEER_STORE)
export class PrunePeerStoreProcessor extends WorkerHost {
  protected readonly logger = new Logger(PrunePeerStoreProcessor.name);
  constructor(private readonly appService: AppService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case JOB_NAME_PRUNE_PEER_STORE: {
        const maxPeers = Number(job.data);
        this.logger.debug('Job triggered: Prune Peer Store');
        try {
          await this.appService.prunePeerStore(maxPeers);
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
