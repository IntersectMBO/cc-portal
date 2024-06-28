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
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { HotAddress } from '../entities/hotaddress.entity';
import { VoteMapper } from '../mapper/vote.mapper';
import { Vote } from '../entities/vote.entity';
import { VoteRequest } from '../dto/vote.request';
import { GovActionProposal } from '../../governance-action-proposal/entities/gov-action-proposal.entity';
import { PageOptionsDto } from '../../util/pagination/dto/page-options.dto';
import { ConfigService } from '@nestjs/config';
import { GovActionProposalDto } from '../../governance-action-proposal/dto/gov-action-proposal.dto';
import { GovActionProposalService } from '../../governance-action-proposal/services/gov-action-proposal.service';
import axios from 'axios';
import { GovActionProposalMapper } from '../../governance-action-proposal/mapper/gov-action-proposal.mapper';
import { GovActionProposalRequest } from '../../governance-action-proposal/dto/gov-action-proposal.request';

@Injectable()
export class VoteService {
  private logger = new Logger(VoteService.name);
  constructor(
    @InjectDataSource(CONNECTION_NAME_DB_SYNC)
    private dataSource: DataSource,
    @InjectRepository(HotAddress)
    private readonly hotAddressRepository: Repository<HotAddress>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(GovActionProposal)
    private readonly govActionProposalRepository: Repository<GovActionProposal>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
    private readonly govActionProposalService: GovActionProposalService,
  ) {}

  async storeVoteData(voteRequest: VoteRequest[]): Promise<void> {
    const votes = await this.prepareVotes(voteRequest);
    const govActionProposalRequest: GovActionProposalRequest[] =
      await this.getGovActionProposalsFromDbSync(voteRequest);
    try {
      // TODO: ask Aca should we store gaps from votes with valid urls that don't have abstract & title
      await this.govActionProposalService.storeGovActionProposalData(
        govActionProposalRequest,
      );
      await this.entityManager.transaction(async () => {
        return await this.voteRepository.save(votes);
      });
    } catch (e) {
      this.logger.error(`Error within transaction: ${e.message}`);
      throw new InternalServerErrorException('Transaction failed');
    }
  }

  private async prepareVotes(
    voteRequests: VoteRequest[],
  ): Promise<Partial<Vote[]>> {
    const votes = [];
    const govActionProposalIds: string[] = [];
    voteRequests.forEach((voteRequest) => {
      govActionProposalIds.push(voteRequest.govActionProposalId);
    });
    const existingGovActionProposal =
      await this.findGovActionProposalFromIds(govActionProposalIds);
    for (let i = 0; i < voteRequests.length; i++) {
      if (existingGovActionProposal[i]) {
        continue;
      }
      const govActionProposal = await this.prepareGovActionProposal(
        voteRequests[i],
      );
      if (!govActionProposal) {
        continue;
      }
      const vote = {
        id: voteRequests[i].id,
        userId: voteRequests[i].userId,
        hotAddress: voteRequests[i].hotAddress,
        vote: voteRequests[i].vote,
        title: voteRequests[i].reasoningTitle,
        comment: voteRequests[i].comment,
        submitTime: voteRequests[i].submitTime,
        govActionProposal: govActionProposal.id,
      };
      votes.push(vote);
    }
    return votes;
  }

  private async prepareGovActionProposal(
    voteRequest: VoteRequest,
  ): Promise<Partial<GovActionProposal>> {
    let govActionProposal: GovActionProposal;

    const govActionProposalDto: Partial<GovActionProposalDto> =
      await this.getGovActionProposalFromUrl(voteRequest.govMetadataUrl);
    if (govActionProposalDto) {
      govActionProposalDto.id = voteRequest.govActionProposalId;
      govActionProposalDto.votingAnchorId = voteRequest.votingAnchorId;
      govActionProposalDto.status = voteRequest.status;
      govActionProposalDto.endTime = voteRequest.endTime;
      govActionProposalDto.txHash = voteRequest.txHash;
      govActionProposalDto.govActionType = voteRequest.govActionType;
      govActionProposalDto.govMetadataUrl = voteRequest.govMetadataUrl;

      govActionProposal =
        this.govActionProposalRepository.create(govActionProposalDto);
    }

    return govActionProposal;
  }

  private async findGovActionProposalFromIds(
    govActionProposalIds: string[],
  ): Promise<GovActionProposalDto[]> {
    const govActionProposals = await this.govActionProposalRepository.find({
      where: {
        id: In(govActionProposalIds),
      },
    });

    const govActionProposalDtos: GovActionProposalDto[] = [];

    govActionProposals.forEach((govActionProposal) => {
      govActionProposalDtos.push(
        GovActionProposalMapper.govActionProposalToDto(govActionProposal),
      );
    });

    return govActionProposalDtos;
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
      const title: string = jsonData.body?.title;
      const abstract: string = jsonData.body?.abstract;
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

  async getVoteDataFromDbSync(
    mapHotAddresses: Map<string, string>,
  ): Promise<VoteRequest[]> {
    const addresses = [...mapHotAddresses.keys()];
    const dbData = await this.getDataFromSqlFile(
      SQL_FILE_PATH.GET_VOTES,
      addresses,
    );
    const results: VoteRequest[] = [];
    if (dbData.length > 0) {
      dbData.forEach((vote) => {
        results.push(VoteMapper.dbSyncToVoteRequest(vote, mapHotAddresses));
      });
    }

    return results;
  }

  private async getGovActionProposalsFromDbSync(
    voteRequests: VoteRequest[],
  ): Promise<GovActionProposalRequest[]> {
    const voteIds: string[] = [];
    voteRequests.forEach((voteRequest) => {
      voteIds.push(voteRequest.id);
    });
    const dbData = await this.getDataFromSqlFile(
      SQL_FILE_PATH.GET_GOV_ACTION_PROPOSALS_FROM_VOTES,
      voteIds,
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

  private async getDataFromSqlFile(
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

  async countHotAddressPages(): Promise<number> {
    const countedHotAddresses: number = await this.hotAddressRepository.count();
    const pages: number = Math.ceil(
      countedHotAddresses /
        this.configService.getOrThrow('HOT_ADDRESSES_PER_PAGE'),
    );
    return pages;
  }

  async getMapHotAddresses(
    hotAddressPage: number,
  ): Promise<Map<string, string>> {
    const pageOptions = new PageOptionsDto();
    pageOptions.page = hotAddressPage;
    pageOptions.perPage = this.configService.getOrThrow(
      'HOT_ADDRESSES_PER_PAGE',
    );
    const { skip } = pageOptions;
    const findOptions = {
      take: this.configService.getOrThrow('HOT_ADDRESSES_PER_PAGE'),
      skip: skip,
    };
    const hotAddresses = await this.hotAddressRepository.find(findOptions);
    const mapHotAddresses = new Map<string, string>();
    hotAddresses.forEach((x) => {
      mapHotAddresses.set(x.address, x.user.id);
    });

    return mapHotAddresses;
  }
}
