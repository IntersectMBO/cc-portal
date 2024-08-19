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
import { PageOptionsDto } from '../../util/pagination/dto/page-options.dto';
import { ConfigService } from '@nestjs/config';
import { CommonService } from 'src/common/common-service';
import { GovActionProposalDto } from '../dto/gov-action-proposal.dto';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';

@Injectable()
export class VoteService extends CommonService {
  // private cronInterval: string;

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
  ) {
    super(dataSource);
    // this.cronInterval =
    //   this.configService.get<string>('VOTES_JOB_FREQUENCY') || '0 * * * * *';
    this.logger = new Logger(VoteService.name);
  }

  // getCronExpression(): string {
  //   return this.cronInterval;
  // }

  async storeVoteData(voteRequests: VoteRequest[]): Promise<void> {
    const votes = await this.prepareVotes(voteRequests);
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
      // returns GAP entity or null
      const existingGAP = await this.findGAPForVote(
        voteRequests[i],
        existingGAPs,
      );
      const vote: Partial<Vote> = {
        id: voteRequests[i].id,
        userId: voteRequests[i].userId,
        hotAddress: voteRequests[i].hotAddress,
        vote: voteRequests[i].vote,
        title: voteRequests[i].rationaleTitle,
        comment: voteRequests[i].comment,
        submitTime: new Date(voteRequests[i].submitTime),
        govActionProposal: existingGAP,
      };
      if (!existingGAP) {
        const govActionProposal = await this.prepareGAP(voteRequests[i]);
        vote.govActionProposal = govActionProposal;
      }
      votes.push(vote);
    }
    return votes;
  }

  private async findGAPsForVotes(
    voteRequests: VoteRequest[],
  ): Promise<GovActionProposal[]> {
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

  private async findGAPForVote(
    voteRequest: VoteRequest,
    existingGAPs: GovActionProposal[],
  ): Promise<GovActionProposal | null> {
    const foundGap = existingGAPs.find(
      (gap) => gap.id === voteRequest.govActionProposalId,
    );
    if (foundGap) {
      return foundGap;
    }
    return null;
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
    govActionProposalDto.submitTime = voteRequest.govActionProposalSubmitTime;

    const govActionProposal =
      this.govActionProposalRepository.create(govActionProposalDto);

    return govActionProposal;
  }

  private async findGovActionProposalFromIds(
    govActionProposalIds: string[],
  ): Promise<GovActionProposal[]> {
    const govActionProposals = await this.govActionProposalRepository.find({
      where: {
        id: In(govActionProposalIds),
      },
    });

    return govActionProposals;
  }

  async getVoteDataFromDbSync(
    mapHotAddresses: Map<string, string>,
  ): Promise<VoteRequest[]> {
    const prefix = '\\x'; // prefix for each hot address
    const addresses = [...mapHotAddresses.keys()].map((key) => prefix + key);
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
