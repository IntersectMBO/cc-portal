import { Module } from '@nestjs/common';
import { VoteProcessor } from './vote.processor';
import { VoteProducer } from './vote.producer';
import { BullModule } from '@nestjs/bullmq';
import {
  FLOW_NAME_EXTRACT_VOTE_DATA,
  QUEUE_NAME_DB_SYNC,
} from '../common/constants/bullmq.constants';
import { VoteFacade } from './facade/vote.facade';
import { VoteService } from './services/vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { GovActionProposal } from './entities/gov-action-proposal.entity';
import { HotAddress } from './entities/hotaddress.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote, GovActionProposal, HotAddress, User]),
    BullModule.registerQueue({
      name: QUEUE_NAME_DB_SYNC,
    }),
    BullModule.registerFlowProducer({ name: FLOW_NAME_EXTRACT_VOTE_DATA }),
  ],
  providers: [VoteFacade, VoteProducer, VoteProcessor, VoteService],
})
export class VoteModule {}
