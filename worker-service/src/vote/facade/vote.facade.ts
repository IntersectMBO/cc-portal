import { Cron, CronExpression } from '@nestjs/schedule';
import { VoteProducer } from '../vote.producer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VoteFacade {
  private logger = new Logger(VoteFacade.name);
  constructor(
    private readonly producer: VoteProducer,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async syncVotesTable() {
    // const inputData = await this.getUserData();
    this.producer.voteFlowProducer();
  }

  async getUserData() {
    return [
      {
        userId: 'd05b2b01-ec91-455c-b2a0-9798ef7ab6c3',
        hotAddress: '4bfd30ff-1ea3-44aa-8a99-fcdb2b163d80',
        govActionProposalId: '5aac3bab-dbf4-4d50-8e6c-bb3a91b1cc6e',
        vote: 'Yes',
        title: 'Some simple title',
        comment: 'Some short comment',
        type: 'NewConstitution',
        endTime: '2024-05-21 15:27:37.776',
        time: '2024-05-17 11:04:33.219',
      },
      {
        userId: 'd05b2b01-ec91-455c-b2a0-9798ef7ab6c3',
        hotAddress: '4bfd30ff-1ea3-44aa-8a99-fcdb2b163d80',
        govActionProposalId: '5aac3bab-dbf4-4d50-8e6c-bb3a91b1cc6e',
        vote: 'No',
        title: 'Some simple title',
        comment: 'Some short comment',
        type: 'NewConstitution',
        endTime: '2024-05-21 15:27:37.776',
        time: '2024-05-17 11:04:33.219',
      },
    ];
  }
}
