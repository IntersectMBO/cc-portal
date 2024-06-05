import { Module } from '@nestjs/common';
import { GovernanceFacade } from './facade/governance.facade';
import { GovernanceService } from './services/governance.service';
import { GovernanceController } from './api/governance.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovActionProposal } from './entities/gov-action-proposal.entity';
import { Vote } from './entities/vote.entity';
import { Paginator } from 'src/util/pagination/paginator';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, GovActionProposal]), UsersModule],
  controllers: [GovernanceController],
  providers: [GovernanceFacade, GovernanceService, Paginator],
  exports: [],
})
export class GovernanceModule {}
