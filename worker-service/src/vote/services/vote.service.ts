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
import { HotAddress } from '../entities/hotaddress.entity';
import { VoteMapper } from '../mapper/vote.mapper';
import { Vote } from '../entities/vote.entity';
import { VoteRequest } from '../dto/vote.request';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { GovActionProposalDto } from '../dto/gov-action-proposal.dto';
import { PageOptionsDto } from '../../util/pagination/dto/page-options.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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
  ) {}

  async storeVoteData(voteRequest: VoteRequest[]): Promise<void> {
    const votes = await this.prepareVotes(voteRequest);
    console.log(votes);
    try {
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
    for (let i = 0; i < voteRequests.length; i++) {
      const govActionProposal = await this.prepareGovActionProposal(
        voteRequests[i],
      );
      const vote = {
        id: voteRequests[i].id,
        userId: voteRequests[i].userId,
        hotAddress: voteRequests[i].hotAddress,
        vote: voteRequests[i].vote,
        title: voteRequests[i].title,
        comment: voteRequests[i].comment,
        govActionType: voteRequests[i].govActionType,
        govActionProposal: govActionProposal,
        status: voteRequests[i].status,
        endTime: voteRequests[i].endTime,
        submitTime: voteRequests[i].submitTime,
      };
      votes.push(vote);
    }
    return votes;
  }

  private async prepareGovActionProposal(
    voteRequest: VoteRequest,
  ): Promise<Partial<GovActionProposal>> {
    const existingGovActionProposal = await this.findGovActionProposal(
      voteRequest.govActionProposalId,
    );
    if (existingGovActionProposal) {
      return existingGovActionProposal;
    }
    const govActionProposalDto: Partial<GovActionProposalDto> =
      await this.getGovActionProposalFromUrl(voteRequest.govMetadataUrl);
    govActionProposalDto.id = voteRequest.govActionProposalId;
    govActionProposalDto.votingAnchorId = voteRequest.votingAnchorId;
    govActionProposalDto.status = voteRequest.status;

    const govActionProposal =
      this.govActionProposalRepository.create(govActionProposalDto);

    return govActionProposal;
  }

  private async findGovActionProposal(
    govActionProposalId: string,
  ): Promise<GovActionProposal> {
    const govActionProposal = this.govActionProposalRepository.findOne({
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

  async getVoteDataFromDbSync(
    mapHotAddresses: Map<string, string>,
  ): Promise<VoteRequest[]> {
    const addresses = [...mapHotAddresses.keys()];
    const dbData = await this.getVotesFromSqlFile(
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

  private async getVotesFromSqlFile(
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