import { Module } from '@nestjs/common';
import { IpfsService } from './services/ipfs.service';
import { IpfsController } from './api/ipfs.controller';
import { Ipfs } from './entities/ipfs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpfsFacade } from './facade/ipfs.facade';

@Module({
  imports: [TypeOrmModule.forFeature([Ipfs])],
  providers: [IpfsFacade, IpfsService],
  controllers: [IpfsController],
  exports: [IpfsService],
})
export class IpfsModule {}
