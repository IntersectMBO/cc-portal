import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { VoteModule } from './vote/vote.module';
import { BullmqModule } from './bullmq/bullmq.module';
import { DatabaseModule } from './database/database.module';
import { GovernanceActionProposalModule } from './governance-action-proposal/gov-action-proposal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    BullmqModule,
    VoteModule,
    GovernanceActionProposalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
