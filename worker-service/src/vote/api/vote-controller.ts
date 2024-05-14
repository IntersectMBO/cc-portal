import { Controller, Get } from '@nestjs/common';
import { VoteProducer } from '../voteTable.producer.js';
import { Cron, CronExpression } from '@nestjs/schedule';
import { faker } from '@faker-js/faker';

@Controller('vote-controller')
export class VoteController {
  constructor(private readonly producer: VoteProducer) {}

  @Cron(CronExpression.EVERY_5_SECONDS, { timeZone: 'Europe/Belgrade' })
  @Get('vote')
  async syncVotesTable() {
    const dummyData = {
      user: faker.person.firstName(),
      email: faker.internet.email(),
      vote: 'yes',
    };
    this.producer.votesTableProducer(dummyData);
  }
}
