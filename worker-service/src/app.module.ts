import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { VoteModule } from './vote/vote.module';
import { BullmqModule } from './bullmq/bullmq.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    BullmqModule,
    VoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
