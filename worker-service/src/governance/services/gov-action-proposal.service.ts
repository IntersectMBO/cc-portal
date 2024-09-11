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
import { GovActionProposalRequest } from '../dto/gov-action-proposal.request';
import { GovActionProposalMapper } from '../mapper/gov-action-proposal.mapper';
import { CommonService } from 'src/common/common-service';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GovActionProposalService extends CommonService {
  // private cronInterval: string;

  constructor(
    @InjectDataSource(CONNECTION_NAME_DB_SYNC)
    dataSource: DataSource,
    @InjectRepository(GovActionProposal)
    private readonly govActionProposalRepository: Repository<GovActionProposal>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {
    super(dataSource);
    // this.cronInterval =
    //   this.configService.get<string>('GOV_ACTION_PROPOSALS_JOB_FREQUENCY') ||
    //   '0 * * * * *';
    this.logger = new Logger(GovActionProposalService.name);
  }

  // getCronExpression(): string {
  //   return this.cronInterval;
  // }

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
      const govActionProposal = {
        id: request.id,
        votingAnchorId: request.votingAnchorId,
        govActionType: request.govActionType,
        govMetadataUrl: request.govMetadataUrl,
        endTime: request?.endTime,
        status: request.status,
        txHash: request.txHash,
        submitTime: request.submitTime,
        title: axiosData?.title,
        abstract: axiosData?.abstract,
      };
      govActionProposals.push(govActionProposal);
    }

    return govActionProposals;
  }

  async getGovActionProposalDataFromDbSync(
    perPage: number,
    offset: number,
  ): Promise<GovActionProposalRequest[]> {
    const dbData = await this.getPaginatedDataFromSqlFile(
      SQL_FILE_PATH.GET_GOV_ACTION_PROPOSALS_DATA,
      perPage,
      offset,
    );
    const results: GovActionProposalRequest[] = [];

    dbData?.forEach((govActionProposal) => {
      results.push(
        GovActionProposalMapper.dbSyncToGovActionProposalRequest(
          govActionProposal,
        ),
      );
    });

    return results;
  }
}
