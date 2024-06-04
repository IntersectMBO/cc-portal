import { Module } from '@nestjs/common';
import { GovernanceFacade } from './facade/governance.facade';
import { GovernanceService } from './services/governance.service';
import { GovernanceController } from './api/governance.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [GovernanceController],
  providers: [GovernanceFacade, GovernanceService],
  exports: [],
})
export class GovernanceModule {}
