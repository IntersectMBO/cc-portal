import { ConfigService } from '@nestjs/config';
import { IJob } from '../i-job';
import { GovernanceFacade } from 'src/governance/facade/governance.facade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SyncGovVotesJob implements IJob {
  constructor(
    private readonly configService: ConfigService,
    private readonly governanceFacade: GovernanceFacade,
  ) {}
  getJobName(): string {
    return 'Sync Governance Votes';
  }
  getInterval(): string {
    return (
      this.configService.get<string>('VOTES_JOB_FREQUENCY') || '0 * * * * *'
    );
  }
  execute(): void {
    this.governanceFacade.syncVotesTable();
  }
}
