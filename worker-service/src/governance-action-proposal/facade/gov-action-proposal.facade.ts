import { Injectable, Logger } from '@nestjs/common';
import { GovActionProposalService } from '../services/gov-action-proposal.service';
import { GovActionProposalProducer } from '../gov-action-proposal.producer';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { JOB_NAME_GOV_ACTIONS_SYNC } from '../../common/constants/bullmq.constants';

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
      '*/30 * * * * *';
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
    const govActionProposalIdsArray: object[] =
      await this.govActionProposalService.getGovActionProposalIds();

    const perPage: number = Number(
      this.configService.getOrThrow('GOV_ACTION_PROPOSALS_PER_PAGE'),
    );
    for (let i = 0; i <= govActionProposalIdsArray.length; i += perPage) {
      const chunk: object[] = govActionProposalIdsArray.slice(i, i + perPage);
      const govActionProposalIdsValues: string[] = chunk.map(
        (obj) => (obj as any).id,
      );

      this.logger.log(govActionProposalIdsValues);
      const dbSyncData =
        await this.govActionProposalService.getGovActionProposalDataFromDbSync(
          govActionProposalIdsValues,
        );
      await this.producer.addToGovActionQueue(dbSyncData);
    }
  }

  private getCronExpression(): string {
    return this.cronInterval;
  }
}
