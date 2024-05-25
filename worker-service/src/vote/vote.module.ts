import { Module } from '@nestjs/common';
import { VotesTableSyncConsumer } from './queues/votesTableSync.consumer';
import { BullModule } from '@nestjs/bullmq';
import {
  FLOW_NAME_EXTRACT_VOTE_DATA,
  QUEUE_NAME_VOTES_TABLE_SYNC,
} from 'src/common/constants';
import { VoteFacade } from './facade/vote.facade';
import { Vote } from './entities/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteService } from './services/vote.service';
import { VotesTableSyncListener } from './events/votesTableSync.listener';
import { VotesTableSyncProducer } from './queues/votesTableSync.producer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote]),
    BullModule.registerQueue({
      name: QUEUE_NAME_VOTES_TABLE_SYNC,
    }),
    BullModule.registerFlowProducer({ name: FLOW_NAME_EXTRACT_VOTE_DATA }),
  ],
  providers: [
    VoteService,
    VoteFacade,
    VotesTableSyncConsumer,
    VotesTableSyncProducer,
    VotesTableSyncListener,
  ],
})
export class VoteModule {}
