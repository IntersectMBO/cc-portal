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
import { ReasoningDto } from '../dto/reasoning.dto';
import { Reasoning } from '../entities/reasoning.entity';
import { GOVERNANCE_ACTION_PROPOSAL_CONFIG } from '../util/pagination/gap-pagination.config';

@Injectable()
export class GovernanceService {
  private logger = new Logger(GovernanceService.name);

  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(GovActionProposal)
    private readonly govActionMetadataRepository: Repository<GovActionProposal>,
    @InjectRepository(Reasoning)
    private readonly reasoningRepository: Repository<Reasoning>,

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
        'governanceActionProposals.reasonings',
        'reasoning',
        'reasoning.userId = :userId',
        { userId: userId },
      );
  }

  async addReasoning(reasoningDto: ReasoningDto): Promise<ReasoningDto> {
    const reasoning = this.reasoningRepository.create(reasoningDto);
    const savedReasoning = await this.reasoningRepository.save(reasoning);
    return GovernanceMapper.reasoningToDto(savedReasoning);
  }

  async findReasoningForUserByProposalId(
    userId: string,
    proposalId: string,
  ): Promise<ReasoningDto> {
    const reasoning = await this.reasoningRepository.findOne({
      where: {
        userId: userId,
        govActionProposalId: proposalId,
      },
    });
    if (!reasoning) {
      throw new NotFoundException(`Reasoning not found`);
    }
    return GovernanceMapper.reasoningToDto(reasoning);
  }
}
