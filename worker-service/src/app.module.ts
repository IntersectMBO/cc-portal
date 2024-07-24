import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullmqModule } from './bullmq/bullmq.module';
import { DatabaseModule } from './database/database.module';
import { GovernanceModule } from './governance/governance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    BullmqModule,
    GovernanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
