import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Role } from './src/users/entities/role.entity';
import { User } from './src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Permission } from './src/users/entities/permission.entity';
import { HotAddress } from './src/users/entities/hotaddress.entity';
import { IpfsMetadata } from './src/ipfs/entities/ipfs-metadata.entity';
import { Vote } from './src/governance/entities/vote.entity';
import { GovActionProposal } from './src/governance/entities/gov-action-proposal.entity';
import { Rationale } from './src/governance/entities/rationale.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  database: configService.getOrThrow('POSTGRES_DB'),
  username: configService.getOrThrow('POSTGRES_USERNAME'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),
  migrations: ['migrations/**'],
  migrationsTableName: 'migrations',
  entities: [
    User,
    Role,
    Permission,
    HotAddress,
    IpfsMetadata,
    Vote,
    GovActionProposal,
    Rationale,
  ],
  ...(configService.get('POSTGRES_TLS') === 'false'
    ? {}
    : {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
});
