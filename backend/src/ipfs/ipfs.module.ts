import { Module } from '@nestjs/common';
import { IpfsService } from './services/ipfs.service';
import { IpfsMetadata } from './entities/ipfs-metadata.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([IpfsMetadata])],
  providers: [IpfsService],
  controllers: [],
  exports: [IpfsService],
})
export class IpfsModule {}
