import { Injectable, Logger } from '@nestjs/common';
import { GovActionProposalService } from '../services/gov-action-proposal.service';
import { GovActionProposalProducer } from '../gov-action-proposal.producer';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class GovActionProposalFacade {
  private logger = new Logger(GovActionProposalFacade.name);
  constructor(
    private readonly producer: GovActionProposalProducer,
    private readonly govActionProposalService: GovActionProposalService,
  ) {}

  @Cron('*/30 * * * * *') // Job runs every 30 seconds
  async syncGovActionProposalTable() {
    const govActionProposalIdsArray: object[] =
      await this.govActionProposalService.getGovActionProposalIds();

    if (govActionProposalIdsArray.length > 0) {
      for (let i = 0; i <= govActionProposalIdsArray.length + 10; i += 10) {
        if (i >= govActionProposalIdsArray.length) {
          break;
        }
        const chunk: object[] = govActionProposalIdsArray.slice(i, i + 10);
        const govActionProposalIdsValues: string[] = chunk.map(
          (obj) => (obj as any).id,
        );

        console.log(govActionProposalIdsValues);
        const dbSyncData =
          await this.govActionProposalService.getGovActionProposalDataFromDbSync(
            govActionProposalIdsValues,
          );
        await this.producer.addToGovActionQueue(dbSyncData);
      }
    }
  }
}
