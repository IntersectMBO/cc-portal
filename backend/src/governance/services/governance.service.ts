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
import { GovActionMetaDto } from '../dto/gov-action-meta.dto';
import { Paginator } from 'src/util/pagination/paginator';

@Injectable()
export class GovernanceService {
  private logger = new Logger(GovernanceService.name);

  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(GovActionProposal)
    private readonly govActionMetadataRepository: Repository<GovActionProposal>,

    private readonly paginator: Paginator,
  ) {}

  async findGovActionMetadataById(id: number): Promise<GovActionMetaDto> {
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
      ? this.createUserVotesQuery(userId)
      : this.createAllVotesQuery();

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

  private createUserVotesQuery(userAddress: string): SelectQueryBuilder<Vote> {
    return this.voteRepository
      .createQueryBuilder('votes')
      .leftJoinAndSelect('votes.govActionProposal', 'govActionProposal')
      .where('votes.userId = :userId', { userId: userAddress });
  }

  private createAllVotesQuery(): SelectQueryBuilder<Vote> {
    return this.voteRepository
      .createQueryBuilder('votes')
      .leftJoinAndSelect('votes.govActionProposal', 'govActionProposal');
  }
}
