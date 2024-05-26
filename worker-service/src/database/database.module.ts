import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        name: configService.getOrThrow('BE_CONNECTION_NAME'),
        type: 'postgres',
        host: configService.getOrThrow('BE_POSTGRES_HOST'),
        port: configService.getOrThrow('BE_POSTGRES_PORT'),
        database: configService.getOrThrow('BE_POSTGRES_DB'),
        username: configService.getOrThrow('BE_POSTGRES_USERNAME'),
        password: configService.getOrThrow('BE_POSTGRES_PASSWORD'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: process.env.DB_SYNC_CONNECTION_NAME,
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_SYNC_POSTGRES_HOST'),
        port: configService.getOrThrow('DB_SYNC_POSTGRES_PORT'),
        database: configService.getOrThrow('DB_SYNC_POSTGRES_DB'),
        schema: configService.getOrThrow('DB_SYNC_POSTGRES_SCHEMA'),
        username: configService.getOrThrow('DB_SYNC_POSTGRES_USERNAME'),
        password: configService.getOrThrow('DB_SYNC_POSTGRES_PASSWORD'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
