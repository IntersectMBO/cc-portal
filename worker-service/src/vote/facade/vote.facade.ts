import { VoteProducer } from '../vote.producer';
import { Injectable, Logger } from '@nestjs/common';
import { VoteService } from '../services/vote.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ConfigService } from '@nestjs/config';
import { JOB_NAME_VOTE_SYNC } from '../../common/constants/bullmq.constants';

@Injectable()
export class VoteFacade {
  private logger = new Logger(VoteFacade.name);
  private cronInterval: string;

  constructor(
    private readonly producer: VoteProducer,
    private readonly voteService: VoteService,
    private schedulerRegistry: SchedulerRegistry,
    private configService: ConfigService,
  ) {
    this.cronInterval =
      this.configService.get<string>('SCHEDULER_JOBS_DB_SYNC_FREQUENCY') ||
      '0 * * * * *';
    this.addCronJob();
  }

  addCronJob() {
    const job = new CronJob(this.getCronExpression(), () => {
      this.syncVotesTable();
    });

    this.schedulerRegistry.addCronJob(JOB_NAME_VOTE_SYNC, job);
    job.start();
  }

  async syncVotesTable() {
    const pages = await this.voteService.countHotAddressPages();

    for (let i = 1; i <= pages; i++) {
      const mapHotAddresses = await this.voteService.getMapHotAddresses(i);
      const dbSyncData =
        await this.voteService.getVoteDataFromDbSync(mapHotAddresses);
      await this.producer.addToVoteQueue(dbSyncData);
    }
  }

  private getCronExpression(): string {
    return this.cronInterval;
  }
}
