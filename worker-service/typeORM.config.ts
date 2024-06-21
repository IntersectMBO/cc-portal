import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Vote } from './src/vote/entities/vote.entity';
import { DataSource } from 'typeorm';
import { GovActionProposal } from './src/governance-action-proposal/entities/gov-action-proposal.entity';
import { Reasoning } from './src/governance-action-proposal/entities/reasoning.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('BE_POSTGRES_HOST'),
  port: configService.getOrThrow('BE_POSTGRES_PORT'),
  database: configService.getOrThrow('BE_POSTGRES_DB'),
  username: configService.getOrThrow('BE_POSTGRES_USERNAME'),
  password: configService.getOrThrow('BE_POSTGRES_PASSWORD'),
  migrations: ['migrations/**'],
  migrationsTableName: 'migrations',
  entities: [Vote, GovActionProposal, Reasoning],
});
