import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
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
      const existingGovActionProposal: GovActionProposal =
        await this.findGovActionProposal(govActionProposalRequests[i].id);
      if (existingGovActionProposal) {
        continue;
      }

      const govMetadataUrl = govActionProposalRequests[i].govMetadataUrl;
      if (
        govMetadataUrl.indexOf('http') == -1 ||
        govMetadataUrl.indexOf('https') == -1
      ) {
        continue;
      }
      if (!govActionProposalRequests[i].endTime) {
        continue;
      }
      const axiosData = await this.getGovActionProposalFromUrl(govMetadataUrl);
      const hash = govActionProposalRequests[i].txHash;
      const govActionProposal = {
        id: govActionProposalRequests[i].id,
        votingAnchorId: govActionProposalRequests[i].votingAnchorId,
        govActionType: govActionProposalRequests[i].govActionType,
        govMetadataUrl: govActionProposalRequests[i].govMetadataUrl,
        endTime: govActionProposalRequests[i].endTime,
        status: govActionProposalRequests[i].status,
        txHash: hash,
        title: axiosData.title,
        abstract: axiosData.abstract,
      };
      govActionProposals.push(govActionProposal);
    }
    return govActionProposals;
  }

  private async findGovActionProposal(
    govActionProposalId: string,
  ): Promise<GovActionProposal> {
    const govActionProposal = await this.govActionProposalRepository.findOne({
      where: {
        id: govActionProposalId,
      },
    });
    return govActionProposal;
  }

  private async getGovActionProposalFromUrl(
    url: string,
  ): Promise<Partial<GovActionProposalDto>> {
    const response = await axios.get(url);
    if (response.status == 404) {
      throw new NotFoundException(
        `Governance action proposal URL is invalid: ${url}`,
      );
    }
    const jsonData = response.data;
    let title: string = '';
    let abstract: string = '';
    if (jsonData['body'] && jsonData.body['title']) {
      title = jsonData.body.title;
    }
    if (jsonData['body'] && jsonData.body['abstract']) {
      abstract = jsonData.body.abstract;
    }
    const govActionProposal: Partial<GovActionProposalDto> = {
      title: title['@value'],
      abstract: abstract['@value'],
      govMetadataUrl: url,
    };
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
