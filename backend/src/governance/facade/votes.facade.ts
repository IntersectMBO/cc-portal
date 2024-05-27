import { Injectable, Logger } from '@nestjs/common';
import { VotesService } from '../services/votes.service';
import { VoteResponse } from '../api/response/vote.response';
import { PaginatedResponse } from 'src/util/pagination/response/paginated.response';
import { VoteDto } from '../dto/vote.dto';
import { VoteMapper } from '../mapper/vote-mapper';
import { UsersService } from 'src/users/services/users.service';
import { PaginateQuery } from 'nestjs-paginate';
import { PaginationDtoMapper } from 'src/util/pagination/mapper/pagination.mapper';

@Injectable()
export class VotesFacade {
  private logger = new Logger(VotesFacade.name);

  constructor(
    private readonly votesService: VotesService,
    private readonly usersService: UsersService,
  ) {}

  async searchVotes(
    query: PaginateQuery,
    userAddress?: string,
  ): Promise<PaginatedResponse<VoteResponse>> {
    const votesPaginatedDto = await this.votesService.searchVotes(
      query,
      userAddress,
    );

    const userNameMap = await this.getUserNameMap(
      votesPaginatedDto.items.map((voteDto) => {
        return voteDto.userId;
      }),
    );

    votesPaginatedDto.items.forEach((vote) => {
      vote.userName = userNameMap.get(vote.userId);
    });

    return new PaginationDtoMapper<VoteDto, VoteResponse>().dtoToResponse(
      votesPaginatedDto,
      VoteMapper.voteDtoToResponse,
    );
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
