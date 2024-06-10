import { VoteProducer } from '../vote.producer';
import { Injectable, Logger } from '@nestjs/common';
import { VoteService } from '../services/vote.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class VoteFacade {
  private logger = new Logger(VoteFacade.name);
  constructor(
    private readonly producer: VoteProducer,
    private readonly voteService: VoteService,
  ) {}

  @Cron('0 */5 * * * *') // every 5 minute
  async syncVotesTable() {
    const pages = await this.voteService.countHotAddressPages();
    if (pages > 0) {
      for (let i = 1; i <= pages; i++) {
        const mapHotAddresses = await this.voteService.getMapHotAddresses(i);
        const dbSyncData =
          await this.voteService.getVoteDataFromDbSync(mapHotAddresses);
        await this.producer.addToVoteQueue(dbSyncData);
        //await this.delay(1000); // delay of 1s for the next iteration
      }
    }
  }

  async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
