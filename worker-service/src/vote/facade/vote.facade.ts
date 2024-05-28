import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { VotesTableSyncProducer } from '../queues/votesTableSync.producer';

@Injectable()
export class VoteFacade {
  constructor(private readonly voteTableSyncProducer: VotesTableSyncProducer) {}

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'sync_votes_table_cron_job' })
  async syncVotesTable() {
    await this.voteTableSyncProducer.syncVotesTable();
  }
}
