import { Processor, WorkerHost } from '@nestjs/bullmq';
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
        try {
          this.logger.debug(
            `Processing GAP - amount of GAPs to be processed, ${job.data?.length}`,
          );
          await this.govActionProposalService.storeGovActionProposalData(
            job.data,
          );
        } catch (error) {
          this.logger.error(
            `Error processing job id: ${job.id}, name: ${job.name}. - Error: ${error}`,
          );
          throw error;
        }
      }
    }
  }
}
