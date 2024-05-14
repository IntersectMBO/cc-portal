import { Module } from '@nestjs/common';
import { VoteTableConsumer } from './voteTable.consumer.js';
import { VoteProducer } from './voteTable.producer.js';
import {
  DB_SYNC_SPECIFIC_VOTES_DATA_QUEUE,
  DB_SYNC_VOTES_TABLE_QUEUE,
} from '../common/constants.js';
import { BullModule } from '@nestjs/bullmq';
import { VoteEventListener } from './voteTable.eventListener.js';
import { VoteController } from './api/vote-controller.js';

@Module({
  imports: [
    BullModule.registerQueue({
      name: DB_SYNC_VOTES_TABLE_QUEUE,
    }),
  ],
  controllers: [VoteController],
  providers: [VoteProducer, VoteTableConsumer, VoteEventListener],
})
export class VoteModule {}
