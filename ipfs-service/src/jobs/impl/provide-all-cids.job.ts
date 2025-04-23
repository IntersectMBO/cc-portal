import { ConfigService } from '@nestjs/config';
import { IJob } from '../i-job';
import { Injectable } from '@nestjs/common';
import { JOB_NAME_PROVIDE_ALL_CIDS } from '../../constants/bullmq.constants.js';
import { AppService } from '../../app.service.js';

@Injectable()
export class ProvideAllCidsJob implements IJob {
  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppService,
  ) {}
  getJobName(): string {
    return JOB_NAME_PROVIDE_ALL_CIDS;
  }
  getInterval(): string {
    return (
      this.configService.get<string>('PROVIDE_ALL_CIDS_INTERVAL') ||
      '0 0 */12 * * *'
    );
  }
  execute(): void {
    this.appService.addProvideAllCidsJob();
  }
}
