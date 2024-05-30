import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { VotesTableSyncProducer } from '../queues/votesTableSync.producer';
import { VoteService } from '../services/vote.service';

@Injectable()
export class VoteFacade {
  constructor(
    private readonly voteTableSyncProducer: VotesTableSyncProducer,
    private readonly voteService: VoteService,
  ) {
    this.syncVotesTable();
  }

  // @Cron(CronExpression.EVERY_10_SECONDS, { name: 'sync_votes_table_cron_job2' })
  async syncVotesTable() {
    const pages = await this.voteService.countHotAddressPages();
    for (let i = 1; i <= pages; i++) {
      const result = await this.voteService.getHotAddresses(i);
      console.log(result);
    }
    await this.voteTableSyncProducer.syncVotesTable();
  }
}
