import { Injectable, Logger } from '@nestjs/common';
import { GovActionProposalProducer } from '../queues/producers/gov-action-proposal.producer';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { JOB_NAME_GOV_ACTIONS_SYNC } from '../../common/constants/bullmq.constants';
import { GovActionProposalRequest } from '../dto/gov-action-proposal.request';
import { GovActionProposalService } from '../services/gov-action-proposal.service';

@Injectable()
export class GovActionProposalFacade {
  private logger = new Logger(GovActionProposalFacade.name);
  private cronInterval: string;

  constructor(
    private readonly producer: GovActionProposalProducer,
    private readonly govActionProposalService: GovActionProposalService,
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.cronInterval =
      this.configService.get<string>('SCHEDULER_JOBS_DB_SYNC_FREQUENCY') ||
      '0 * * * * *';
    this.addCronJob();
  }

  addCronJob() {
    const job = new CronJob(this.getCronExpression(), () => {
      this.syncGovActionProposalTable();
    });

    this.schedulerRegistry.addCronJob(JOB_NAME_GOV_ACTIONS_SYNC, job);
    job.start();
  }

  async syncGovActionProposalTable() {
    const perPage: number = Number(
      this.configService.getOrThrow('GOV_ACTION_PROPOSALS_PER_PAGE'),
    );
    let offset: number = 0;
    let dbSyncData: GovActionProposalRequest[];
    do {
      dbSyncData =
        await this.govActionProposalService.getGovActionProposalDataFromDbSync(
          perPage,
          offset,
        );
      if (dbSyncData.length > 0) {
        await this.producer.addToGovActionQueue(dbSyncData);
      }
      offset += perPage;
    } while (dbSyncData.length === perPage);
  }

  private getCronExpression(): string {
    return this.cronInterval;
  }
}
