import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
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
import { GovActionProposalDto } from '../dto/gov-action-proposal.dto';
import axios from 'axios';
import { GovActionProposalRequest } from '../dto/gov-action-proposal.request';
import { GovActionProposalMapper } from '../mapper/gov-action-proposal.mapper';

@Injectable()
export class GovActionProposalService {
  private logger = new Logger(GovActionProposalService.name);
  constructor(
    @InjectDataSource(CONNECTION_NAME_DB_SYNC)
    private dataSource: DataSource,
    @InjectRepository(GovActionProposal)
    private readonly govActionProposalRepository: Repository<GovActionProposal>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async storeGovActionProposalData(
    govActionProposalRequest: GovActionProposalRequest[],
  ): Promise<void> {
    const govActionProposals = await this.prepareGovActionProposals(
      govActionProposalRequest,
    );
    console.log(govActionProposals);
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
    govActionProposalRequests: GovActionProposalRequest[],
  ): Promise<Partial<GovActionProposal[]>> {
    const govActionProposals = [];
    for (let i = 0; i < govActionProposalRequests.length; i++) {
      const govMetadataUrl = govActionProposalRequests[i].govMetadataUrl;

      const axiosData = await this.getGovActionProposalFromUrl(govMetadataUrl);
      const hash = govActionProposalRequests[i].txHash;
      const govActionProposal = {
        id: govActionProposalRequests[i].id,
        votingAnchorId: govActionProposalRequests[i].votingAnchorId,
        govActionType: govActionProposalRequests[i].govActionType,
        govMetadataUrl: govActionProposalRequests[i].govMetadataUrl,
        endTime: govActionProposalRequests[i]?.endTime,
        status: govActionProposalRequests[i].status,
        txHash: hash,
        title: axiosData?.title,
        abstract: axiosData?.abstract,
      };
      govActionProposals.push(govActionProposal);
    }
    return govActionProposals;
  }

  private async getGovActionProposalFromUrl(
    url: string,
  ): Promise<Partial<GovActionProposalDto>> {
    try {
      let govActionProposal: Partial<GovActionProposalDto> =
        await this.getNonValidMetadataUrl(url);
      if (govActionProposal) {
        return govActionProposal;
      }
      const response = await axios.get(url);
      const jsonData = response.data;
      const title = jsonData.body?.title;
      const abstract = jsonData.body?.abstract;
      if (!title || !abstract) {
        throw new BadRequestException(
          'This url does not contain required data',
        );
      }
      govActionProposal = {
        title: title?.['@value'],
        abstract: abstract?.['@value'],
        govMetadataUrl: url,
      };

      return govActionProposal;
    } catch (err) {
      this.logger.error(err);
    }
  }

  private async getNonValidMetadataUrl(
    url: string,
  ): Promise<Partial<GovActionProposalDto>> {
    let govActionProposal: Partial<GovActionProposalDto>;
    if (!url.includes('http') || !url.includes('https')) {
      govActionProposal = {
        govMetadataUrl: url,
      };
    }
    return govActionProposal;
  }

  async getGovActionProposalIds(): Promise<object[]> {
    const govActionProposalIds: object[] =
      await this.getGovActionProposalIdsFromSqlFile(
        SQL_FILE_PATH.GET_GOV_ACTION_PROPOSAL_IDS,
      );
    return govActionProposalIds;
  }

  async getGovActionProposalDataFromDbSync(
    govActionProposalIdsValues: string[],
  ): Promise<GovActionProposalRequest[]> {
    const dbData = await this.getGovActionProposalDataFromSqlFile(
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

  private async getGovActionProposalIdsFromSqlFile(
    filePath: string,
  ): Promise<object[]> {
    const fullPath = path.resolve(__dirname, filePath);
    const query = fs.readFileSync(fullPath, 'utf-8');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    let result: object[];
    try {
      await queryRunner.startTransaction();
      result = await queryRunner.manager.query(query);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      return result;
    }
  }

  private async getGovActionProposalDataFromSqlFile(
    filePath: string,
    whereInArray: string[],
  ): Promise<object[]> {
    const fullPath = path.resolve(__dirname, filePath);
    let query = fs.readFileSync(fullPath, 'utf-8');
    const placeholders = whereInArray
      .map((_, index) => `$${index + 1}`)
      .join(', ');
    query = query.replace(':whereInArray', placeholders);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    let result: object[];
    try {
      await queryRunner.startTransaction();
      result = await queryRunner.manager.query(query, whereInArray);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      return result;
    }
  }
}
