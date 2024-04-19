import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Role } from './src/users/entities/role.entity';
import { User } from './src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Permission } from './src/users/entities/permission.entity';
import { HotAddress } from './src/users/entities/hotaddress.entity';
import { IpfsMetadata } from './src/ipfs/entities/ipfs-metadata.entity';

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
  entities: [User, Role, Permission, HotAddress, IpfsMetadata],
});
