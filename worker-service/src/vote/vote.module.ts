import { Module } from '@nestjs/common';
import { VoteProcessor } from './vote.processor';
import { VoteProducer } from './vote.producer';
import { BullModule } from '@nestjs/bullmq';
import {
  FLOW_NAME_EXTRACT_VOTE_DATA,
  QUEUE_NAME_DB_SYNC,
} from 'src/common/constants';
import { VoteFacade } from './facade/vote.facade';
import { Vote } from './entities/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote]),
    BullModule.registerQueue({
      name: QUEUE_NAME_DB_SYNC,
    }),
    BullModule.registerFlowProducer({ name: FLOW_NAME_EXTRACT_VOTE_DATA }),
  ],
  providers: [VoteFacade, VoteProducer, VoteProcessor],
})
export class VoteModule {}
