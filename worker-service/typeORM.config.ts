import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { GovActionProposal } from './src/governance/entities/gov-action-proposal.entity';
import { Vote } from './src/governance/entities/vote.entity';

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
  entities: [Vote, GovActionProposal],
});
