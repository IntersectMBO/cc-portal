import { Module } from '@nestjs/common';
import { VoteProcessor } from './vote.processor';
import { VoteProducer } from './vote.producer';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAME_DB_SYNC } from 'src/common/constants';
import { VoteFacade } from './facade/vote.facade';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAME_DB_SYNC,
    }),
  ],
  providers: [VoteFacade, VoteProducer, VoteProcessor],
})
export class VoteModule {}
