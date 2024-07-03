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
import { GovActionProposalMapper } from '../../governance-action-proposal/mapper/gov-action-proposal.mapper';
import { GovActionProposalRequest } from '../../governance-action-proposal/dto/gov-action-proposal.request';
import { CommonService } from 'src/common/common-service';

@Injectable()
export class VoteService extends CommonService {
  constructor(
    @InjectDataSource(CONNECTION_NAME_DB_SYNC)
    dataSource: DataSource,
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
  ) {
    super(dataSource);
    this.logger = new Logger(VoteService.name);
  }

  async storeVoteData(voteRequests: VoteRequest[]): Promise<void> {
    const votes = await this.prepareVotes(voteRequests);
    // 1. Check if they are already within our DB - if yes do nothing
    // 2. If not - get GAP data from db + from metadata url
    // If there is data from metadata url, insert remaining stuff regardless
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
    const existingGAPs = await this.findGAPsForVotes(voteRequests);
    for (let i = 0; i < voteRequests.length; i++) {
      const vote: Partial<Vote> = {
        id: voteRequests[i].id,
        userId: voteRequests[i].userId,
        hotAddress: voteRequests[i].hotAddress,
        vote: voteRequests[i].vote,
        title: voteRequests[i].reasoningTitle,
        comment: voteRequests[i].comment,
        submitTime: new Date(voteRequests[i].submitTime),
      };
      const GAPExistsForVote = await this.checkGAPExistsForVote(
        voteRequests[i],
        existingGAPs,
      );
      if (!GAPExistsForVote) {
        const govActionProposal = await this.prepareGAP(voteRequests[i]);
        vote.govActionProposal = govActionProposal;
      }
      votes.push(vote);
    }
    return votes;
  }

  private async findGAPsForVotes(
    voteRequests: VoteRequest[],
  ): Promise<GovActionProposalDto[]> {
    const govActionProposalIds: string[] = [];
    voteRequests.forEach((voteRequest) => {
      govActionProposalIds.push(voteRequest.govActionProposalId);
    });
    // unique govActionProposalIds
    const govActionProposalIdsUnique: string[] = [
      ...new Set(govActionProposalIds),
    ];
    const existingGovActionProposals = await this.findGovActionProposalFromIds(
      govActionProposalIdsUnique,
    );
    return existingGovActionProposals;
  }

  private async checkGAPExistsForVote(
    voteRequest: VoteRequest,
    existingGAPs: GovActionProposalDto[],
  ): Promise<boolean> {
    return existingGAPs.some(
      (gap) => gap.id === voteRequest.govActionProposalId,
    );
  }

  private async prepareGAP(
    voteRequest: VoteRequest,
  ): Promise<GovActionProposal> {
    const govActionProposalDto: Partial<GovActionProposalDto> =
      await this.getGovActionProposalFromUrl(voteRequest.govMetadataUrl);
    govActionProposalDto.id = voteRequest.govActionProposalId;
    govActionProposalDto.votingAnchorId = voteRequest.votingAnchorId;
    govActionProposalDto.status = voteRequest.status;
    govActionProposalDto.endTime = voteRequest.endTime;
    govActionProposalDto.txHash = Buffer.from(voteRequest.txHash).toString(
      'hex',
    );
    govActionProposalDto.govActionType = voteRequest.govActionType;
    govActionProposalDto.govMetadataUrl = voteRequest.govMetadataUrl;

    const govActionProposal =
      this.govActionProposalRepository.create(govActionProposalDto);

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

  async getVoteDataFromDbSync(
    mapHotAddresses: Map<string, string>,
  ): Promise<VoteRequest[]> {
    const addresses = [...mapHotAddresses.keys()];
    const dbData = await this.getDataFromSqlFile(
      SQL_FILE_PATH.GET_VOTES,
      addresses,
    );
    const results: VoteRequest[] = [];
    dbData.forEach((vote) => {
      results.push(VoteMapper.dbSyncToVoteRequest(vote, mapHotAddresses));
    });
    return results;
  }

  private async getGovActionProposalsFromDbSync(
    voteRequests: VoteRequest[],
  ): Promise<GovActionProposalRequest[]> {
    const voteIds = voteRequests.map((request) => {
      return request.id;
    });
    const dbData = await this.getDataFromSqlFile(
      SQL_FILE_PATH.GET_GOV_ACTION_PROPOSALS_FROM_VOTES,
      voteIds,
    );

    const results: GovActionProposalRequest[] = [];
    dbData.forEach((govActionProposal) => {
      results.push(
        GovActionProposalMapper.dbSyncToGovActionProposalRequest(
          govActionProposal,
        ),
      );
    });
    return results;
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
