import { Injectable } from '@nestjs/common';
import { VotesTableSyncProducer } from '../queues/votesTableSync.producer';

@Injectable()
export class VoteService {
  constructor(
    private readonly votesTableSyncProducer: VotesTableSyncProducer,
  ) {}

  async syncVotesTable() {
    await this.votesTableSyncProducer.syncVotesTable();
  }
}
