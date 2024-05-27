import { Injectable, Logger } from '@nestjs/common';
import { SearchQueryDto } from 'src/util/pagination/dto/search-query.dto';
import { VotesService } from '../services/votes.service';
import { VoteResponse } from '../api/response/vote.response';
import { PaginationResponse } from 'src/util/pagination/response/pagination.response';
import { VoteDto } from '../dto/vote.dto';
import { PageMetaResponse } from 'src/util/pagination/response/page-meta.response';
import { VoteMapper } from '../mapper/vote-mapper';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class VotesFacade {
  private logger = new Logger(VotesFacade.name);

  constructor(
    private readonly votesService: VotesService,
    private readonly usersService: UsersService,
  ) {}

  async searchVotes(
    searchQuery: SearchQueryDto,
    userAddress?: string,
  ): Promise<PaginationResponse<VoteResponse>> {
    const votesPaginatedDto = await this.votesService.searchVotes(
      searchQuery,
      userAddress,
    );

    const voteDtos = votesPaginatedDto.voteDtos;
    const itemCount = votesPaginatedDto.itemCount;

    const userNameMap = await this.getUserNameMap(
      voteDtos.map((voteDto) => {
        return voteDto.userId;
      }),
    );

    voteDtos.forEach((vote) => {
      vote.userName = userNameMap.get(vote.userId);
    });

    const voteResponse: VoteResponse[] = voteDtos.map((userDto: VoteDto) =>
      VoteMapper.voteDtoToResponse(userDto),
    );

    const pageOptionsDto = searchQuery.pageOptions;
    const pageMetaResponse = new PageMetaResponse({
      itemCount,
      pageOptionsDto,
    });

    return new PaginationResponse(voteResponse, pageMetaResponse);
  }

  private async getUserNameMap(ids: string[]): Promise<Map<string, string>> {
    const userDtos = await this.usersService.findMultipleByIds(ids);
    return new Map(
      userDtos.map((user) => {
        return [user.id, user.name];
      }),
    );
  }
}
