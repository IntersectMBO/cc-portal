import { Module } from '@nestjs/common';
import { IpfsService } from './services/ipfs.service';
import { IpfsController } from './api/ipfs.controller';

@Module({
  providers: [IpfsService],
  controllers: [IpfsController],
})
export class IpfsModule {}
