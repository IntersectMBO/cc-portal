import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { VoteDto } from '../dto/vote.dto';
import { PaginatedDto } from 'src/util/pagination/dto/paginated.dto';
import { VOTE_PAGINATION_CONFIG } from '../util/pagination/votes-pagination.config';
import { GovernanceMapper } from '../mapper/governance-mapper';
import { Vote } from '../entities/vote.entity';
import { PaginationEntityMapper } from 'src/util/pagination/mapper/pagination.mapper';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { GovActionProposalDto } from '../dto/gov-action-proposal-dto';
import { Paginator } from 'src/util/pagination/paginator';
import { RationaleDto } from '../dto/rationale.dto';
import { Rationale } from '../entities/rationale.entity';
import { GOVERNANCE_ACTION_PROPOSAL_CONFIG } from '../util/pagination/gap-pagination.config';

@Injectable()
export class GovernanceService {
  private logger = new Logger(GovernanceService.name);

  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(GovActionProposal)
    private readonly govActionMetadataRepository: Repository<GovActionProposal>,
    @InjectRepository(Rationale)
    private readonly rationaleRepository: Repository<Rationale>,

    private readonly paginator: Paginator,
  ) {}

  async findGovProposalById(id: string): Promise<GovActionProposalDto> {
    const govActionProposal = await this.govActionMetadataRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!govActionProposal) {
      throw new NotFoundException(
        `Gov action proposal with id ${id} not found`,
      );
    }
    return GovernanceMapper.govActionProposalToDto(govActionProposal);
  }

  async searchGovVotes(
    query: PaginateQuery,
    userId?: string,
  ): Promise<PaginatedDto<VoteDto>> {
    const customQuery = userId
      ? this.returnUserVotesQuery(userId)
      : this.returnAllVotesQuery();

    const result = await this.paginator.paginate(
      query,
      customQuery,
      VOTE_PAGINATION_CONFIG,
    );

    return new PaginationEntityMapper<Vote, VoteDto>().paginatedToDto(
      result,
      GovernanceMapper.voteToDto,
    );
  }

  private returnUserVotesQuery(userAddress: string): SelectQueryBuilder<Vote> {
    return this.voteRepository
      .createQueryBuilder('votes')
      .leftJoinAndSelect('votes.govActionProposal', 'govActionProposal')
      .where('votes.userId = :userId', { userId: userAddress });
  }

  private returnAllVotesQuery(): SelectQueryBuilder<Vote> {
    return this.voteRepository
      .createQueryBuilder('votes')
      .leftJoinAndSelect('votes.govActionProposal', 'govActionProposal');
  }

  async searchGovActionProposals(
    query: PaginateQuery,
    userId?: string,
  ): Promise<PaginatedDto<GovActionProposalDto>> {
    const customQuery = this.returnGapQuery(userId);

    const result = await this.paginator.paginate(
      query,
      customQuery,
      GOVERNANCE_ACTION_PROPOSAL_CONFIG,
    );

    return new PaginationEntityMapper<
      GovActionProposal,
      GovActionProposalDto
    >().paginatedToDto(result, GovernanceMapper.govActionProposalToDto);
  }

  private returnGapQuery(
    userId: string,
  ): SelectQueryBuilder<GovActionProposal> {
    return this.govActionMetadataRepository
      .createQueryBuilder('governanceActionProposals')
      .leftJoinAndSelect(
        'governanceActionProposals.votes',
        'vote',
        'vote.userId = :userId',
        { userId: userId },
      )
      .leftJoinAndSelect(
        'governanceActionProposals.rationales',
        'rationale',
        'rationale.userId = :userId',
        { userId: userId },
      );
  }

  async addRationale(rationaleDto: RationaleDto): Promise<RationaleDto> {
    const rationale = this.rationaleRepository.create(rationaleDto);
    const savedRationale = await this.rationaleRepository.save(rationale);
    return GovernanceMapper.rationaleToDto(savedRationale);
  }

  async findRationaleForUserByProposalId(
    userId: string,
    proposalId: string,
  ): Promise<RationaleDto> {
    const rationale = await this.rationaleRepository.findOne({
      where: {
        userId: userId,
        govActionProposalId: proposalId,
      },
    });
    if (!rationale) {
      throw new NotFoundException(`Rationale not found`);
    }
    return GovernanceMapper.rationaleToDto(rationale);
  }
}
