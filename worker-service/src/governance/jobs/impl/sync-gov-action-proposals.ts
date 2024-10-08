import { ConfigService } from '@nestjs/config';
import { IJob } from '../i-job';
import { GovernanceFacade } from 'src/governance/facade/governance.facade';
import { Injectable } from '@nestjs/common';
import { JOB_NAME_GOV_ACTIONS_SYNC } from '../../../common/constants/bullmq.constants';

@Injectable()
export class SyncGovActionProposalsJob implements IJob {
  constructor(
    private readonly configService: ConfigService,
    private readonly governanceFacade: GovernanceFacade,
  ) {}
  getJobName(): string {
    return JOB_NAME_GOV_ACTIONS_SYNC;
  }
  getInterval(): string {
    return (
      this.configService.get<string>('GOV_ACTION_PROPOSALS_JOB_FREQUENCY') ||
      '0 * * * * *'
    );
  }
  execute(): void {
    this.governanceFacade.syncGovActionProposalTable();
  }
}
