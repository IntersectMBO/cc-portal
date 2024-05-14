import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { VoteModule } from './vote/vote.module.js';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
        enableOfflineQueue: false,
      },
    }),
    VoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
