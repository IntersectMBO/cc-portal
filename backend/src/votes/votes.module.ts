import { Module } from '@nestjs/common';
import { VotesFacade } from './facade/votes.facade';
import { VotesService } from './services/votes.service';
import { VotesController } from './api/votes.controller';

@Module({
  controllers: [VotesController],
  providers: [VotesFacade, VotesService],
  exports: [],
})
export class UsersModule {}
