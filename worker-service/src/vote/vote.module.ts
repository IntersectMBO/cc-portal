import { Module } from '@nestjs/common';
import { VoteProcessor } from './vote.processor';
import { VoteProducer } from './vote.producer';
import { BullModule } from '@nestjs/bullmq';
import {
  FLOW_NAME_EXTRACT_VOTE_DATA,
  QUEUE_NAME_DB_SYNC_VOTES,
} from '../common/constants/bullmq.constants';
import { VoteFacade } from './facade/vote.facade';
import { VoteService } from './services/vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { GovActionProposal } from '../governance-action-proposal/entities/gov-action-proposal.entity';
import { HotAddress } from './entities/hotaddress.entity';
import { User } from './entities/user.entity';
import { GovActionProposalService } from '../governance-action-proposal/services/gov-action-proposal.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote, GovActionProposal, HotAddress, User]),
    BullModule.registerQueue({
      name: QUEUE_NAME_DB_SYNC_VOTES,
    }),
    BullModule.registerFlowProducer({ name: FLOW_NAME_EXTRACT_VOTE_DATA }),
  ],
  providers: [
    VoteFacade,
    VoteProducer,
    VoteProcessor,
    VoteService,
    GovActionProposalService,
  ],
})
export class VoteModule {}
