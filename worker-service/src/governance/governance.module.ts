import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovActionProposal } from './entities/gov-action-proposal.entity';
import { GovActionProposalService } from './services/gov-action-proposal.service';
import { BullModule } from '@nestjs/bullmq';
import {
  QUEUE_NAME_DB_SYNC_GOV_ACTIONS,
  QUEUE_NAME_DB_SYNC_VOTES,
} from '../common/constants/bullmq.constants';
import { GovernanceFacade } from './facade/governance.facade';
import { VoteService } from './services/vote.service';
import { VoteProcessor } from './queues/processors/vote.processor';
import { VoteProducer } from './queues/producers/vote.producer';
import { GovActionsProposalProcessor } from './queues/processors/gov-action-proposal.processor';
import { GovActionProposalProducer } from './queues/producers/gov-action-proposal.producer';
import { HotAddress } from './entities/hotaddress.entity';
import { Vote } from './entities/vote.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HotAddress, GovActionProposal, Vote, User]),
    BullModule.registerQueue({
      name: QUEUE_NAME_DB_SYNC_GOV_ACTIONS,
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME_DB_SYNC_VOTES,
    }),
  ],
  providers: [
    GovActionProposalService,
    GovernanceFacade,
    GovActionProposalProducer,
    GovActionsProposalProcessor,
    VoteService,
    VoteProducer,
    VoteProcessor,
  ],
})
export class GovernanceModule {}
