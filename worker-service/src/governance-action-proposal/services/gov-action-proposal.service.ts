import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  InjectDataSource,
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import {
  CONNECTION_NAME_DB_SYNC,
  SQL_FILE_PATH,
} from '../../common/constants/sql.constants';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { GovActionProposal } from '../../governance-action-proposal/entities/gov-action-proposal.entity';
import { GovActionProposalRequest } from '../dto/gov-action-proposal.request';
import { GovActionProposalMapper } from '../mapper/gov-action-proposal.mapper';
import { CommonService } from 'src/common/common-service';

@Injectable()
export class GovActionProposalService extends CommonService {
  constructor(
    @InjectDataSource(CONNECTION_NAME_DB_SYNC)
    dataSource: DataSource,
    @InjectRepository(GovActionProposal)
    private readonly govActionProposalRepository: Repository<GovActionProposal>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(dataSource);
    this.logger = new Logger(GovActionProposalService.name);
  }

  async storeGovActionProposalData(
    govActionProposalRequests: GovActionProposalRequest[],
  ): Promise<void> {
    const govActionProposals = await this.prepareGovActionProposals(
      govActionProposalRequests,
    );
    try {
      await this.entityManager.transaction(async () => {
        return await this.govActionProposalRepository.save(govActionProposals);
      });
    } catch (e) {
      this.logger.error(`Error within transaction: ${e.message}`);
      throw new InternalServerErrorException('Transaction failed');
    }
  }

  private async prepareGovActionProposals(
    requests: GovActionProposalRequest[],
  ): Promise<Partial<GovActionProposal[]>> {
    const govActionProposals = [];
    for (const request of requests) {
      const govMetadataUrl = request.govMetadataUrl;
      const axiosData = await this.getGovActionProposalFromUrl(govMetadataUrl);
      const hash = request.txHash;
      const govActionProposal = {
        id: request.id,
        votingAnchorId: request.votingAnchorId,
        govActionType: request.govActionType,
        govMetadataUrl: request.govMetadataUrl,
        endTime: request?.endTime,
        status: request.status,
        txHash: hash,
        title: axiosData?.title,
        abstract: axiosData?.abstract,
      };
      govActionProposals.push(govActionProposal);
    }

    return govActionProposals;
  }

  async getGovActionProposalIds(): Promise<object[]> {
    const govActionProposalIds: object[] = await this.getDataFromSqlFileByPath(
      SQL_FILE_PATH.GET_GOV_ACTION_PROPOSAL_IDS,
    );
    return govActionProposalIds;
  }

  async getGovActionProposalDataFromDbSync(
    govActionProposalIdsValues: string[],
  ): Promise<GovActionProposalRequest[]> {
    const dbData = await this.getDataFromSqlFile(
      SQL_FILE_PATH.GET_GOV_ACTION_PROPOSALS_DATA,
      govActionProposalIdsValues,
    );
    const results: GovActionProposalRequest[] = [];
    if (dbData.length > 0) {
      dbData.forEach((govActionProposal) => {
        results.push(
          GovActionProposalMapper.dbSyncToGovActionProposalRequest(
            govActionProposal,
          ),
        );
      });
    }

    return results;
  }
}
