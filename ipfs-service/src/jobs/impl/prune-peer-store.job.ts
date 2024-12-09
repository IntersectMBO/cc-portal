import { ConfigService } from '@nestjs/config';
import { IJob } from '../i-job';
import { Injectable } from '@nestjs/common';
import { JOB_NAME_PRUNE_PEER_STORE } from '../../constants/bullmq.constants.js';
import { AppService } from '../../app.service.js';

@Injectable()
export class PrunePeerStoreJob implements IJob {
  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppService,
  ) {}
  getJobName(): string {
    return JOB_NAME_PRUNE_PEER_STORE;
  }
  getInterval(): string {
    return (
      this.configService.get<string>('PRUNE_PEER_STORE_INTERVAL') || '0 * * * * *'
    );
  }
  execute(): void {
    this.appService.addPrunePeerStoreJob();
  }
}
