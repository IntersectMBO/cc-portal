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
import { GovActionProposalDto } from '../dto/gov-action-proposal.dto';

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
    const endTimeInterval: number =
      this.configService.getOrThrow('EPOCH_DURATION') *
      this.configService.getOrThrow('GAP_DURATION_IN_EPOCH_COUNT');
    for (const request of requests) {
      const govMetadataUrl = await this.transformIpfsUrl(
        request.govMetadataUrl,
      );
      const axiosData = await this.getGovActionProposalFromUrl(govMetadataUrl);
      const endTime = await this.getEndTime(
        request.submitTime,
        endTimeInterval,
      );
      const govActionProposal: Partial<GovActionProposalDto> = {
        id: request.id,
        votingAnchorId: request.votingAnchorId,
        govActionType: request.govActionType,
        govMetadataUrl: govMetadataUrl,
        endTime: endTime,
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
