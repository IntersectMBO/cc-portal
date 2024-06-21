import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovActionProposal } from './entities/gov-action-proposal.entity';
import { Reasoning } from './entities/reasoning.entity';
import { GovActionProposalService } from './services/gov-action-proposal.service';
import { BullModule } from '@nestjs/bullmq';
import {
  FLOW_NAME_EXTRACT_VOTE_DATA,
  QUEUE_NAME_DB_SYNC_GOV_ACTIONS,
} from '../common/constants/bullmq.constants';
import { GovActionProposalFacade } from './facade/gov-action-proposal.facade';
import { GovActionsProposalProcessor } from './gov-action-proposal.processor';
import { GovActionProposalProducer } from './gov-action-proposal.producer';

@Module({
  imports: [
    TypeOrmModule.forFeature([GovActionProposal, Reasoning]),
    BullModule.registerQueue({
      name: QUEUE_NAME_DB_SYNC_GOV_ACTIONS,
    }),
    BullModule.registerFlowProducer({ name: FLOW_NAME_EXTRACT_VOTE_DATA }),
  ],
  providers: [
    GovActionProposalService,
    GovActionProposalFacade,
    GovActionProposalProducer,
    GovActionsProposalProcessor,
  ],
})
export class GovernanceActionProposalModule {}
