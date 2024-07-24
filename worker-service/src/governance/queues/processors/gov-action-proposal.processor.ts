import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  JOB_NAME_GOV_ACTIONS_SYNC,
  QUEUE_NAME_DB_SYNC_GOV_ACTIONS,
} from '../../../common/constants/bullmq.constants';
import { Logger } from '@nestjs/common';
import { GovActionProposalService } from '../../services/gov-action-proposal.service';

@Processor(QUEUE_NAME_DB_SYNC_GOV_ACTIONS)
export class GovActionsProposalProcessor extends WorkerHost {
  protected readonly logger = new Logger(GovActionsProposalProcessor.name);
  constructor(
    private readonly govActionProposalService: GovActionProposalService,
  ) {
    super();
  }
  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case JOB_NAME_GOV_ACTIONS_SYNC: {
        this.logger.debug('Data from db-sync for gov action proposals job');
        return job.data;
      }
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.govActionProposalService.storeGovActionProposalData(returnvalue);
    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}.`,
    );
  }
}
