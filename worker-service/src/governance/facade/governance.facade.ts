import { Injectable, Logger } from '@nestjs/common';
import { GovActionProposalProducer } from '../queues/producers/gov-action-proposal.producer';
import { ConfigService } from '@nestjs/config';
import { GovActionProposalRequest } from '../dto/gov-action-proposal.request';
import { GovActionProposalService } from '../services/gov-action-proposal.service';
import { VoteService } from '../services/vote.service';
import { VoteProducer } from '../queues/producers/vote.producer';

@Injectable()
export class GovernanceFacade {
  private logger = new Logger(GovernanceFacade.name);

  constructor(
    private readonly govActionProposalProducer: GovActionProposalProducer,
    private readonly voteProducer: VoteProducer,
    private readonly govActionProposalService: GovActionProposalService,
    private readonly voteService: VoteService,
    private readonly configService: ConfigService,
    // private schedulerRegistry: SchedulerRegistry,
  ) {
    // this.addCronJob(
    //   JOB_NAME_GOV_ACTIONS_SYNC,
    //   () => this.syncGovActionProposalTable(),
    //   () => this.govActionProposalService.getCronExpression(),
    // );
    // this.addCronJob(
    //   JOB_NAME_VOTE_SYNC,
    //   () => this.syncVotesTable(),
    //   () => this.voteService.getCronExpression(),
    // );
  }

  // addCronJob(
  //   jobName: string,
  //   jobFunction: () => Promise<void>,
  //   cron: () => string,
  // ): void {
  //   const job = new CronJob(cron(), jobFunction);
  //   this.schedulerRegistry.addCronJob(jobName, job);
  //   job.start();
  // }

  async syncGovActionProposalTable(): Promise<void> {
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
        await this.govActionProposalProducer.addToGovActionQueue(dbSyncData);
      }
      offset += perPage;
    } while (dbSyncData.length === perPage);
  }

  async syncVotesTable(): Promise<void> {
    const pages = await this.voteService.countHotAddressPages();

    for (let i = 1; i <= pages; i++) {
      const mapHotAddresses = await this.voteService.getMapHotAddresses(i);
      const dbSyncData =
        await this.voteService.getVoteDataFromDbSync(mapHotAddresses);
      await this.voteProducer.addToVoteQueue(dbSyncData);
    }
  }
}
