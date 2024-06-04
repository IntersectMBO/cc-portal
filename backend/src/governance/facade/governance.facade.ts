import { Injectable, Logger } from '@nestjs/common';
import { GovernanceService as GovernanceService } from '../services/governance.service';
import { VoteResponse } from '../api/response/vote.response';
import { PaginatedResponse } from 'src/util/pagination/response/paginated.response';
import { VoteDto } from '../dto/vote.dto';
import { GovernanceMapper } from '../mapper/governance-mapper';
import { UsersService } from 'src/users/services/users.service';
import { PaginateQuery } from 'nestjs-paginate';
import { PaginationDtoMapper } from 'src/util/pagination/mapper/pagination.mapper';
import { UserPhotoDto } from '../dto/user-photo.dto';
import { GovernanceActionMetadataResponse } from '../api/response/gov-action-metadata.response';

@Injectable()
export class GovernanceFacade {
  private logger = new Logger(GovernanceFacade.name);

  constructor(
    private readonly governanceService: GovernanceService,
    private readonly usersService: UsersService,
  ) {}

  async findGovActionProposalById(
    id: number,
  ): Promise<GovernanceActionMetadataResponse> {
    const dto = await this.governanceService.findGovActionMetadataById(id);
    return GovernanceMapper.govActionMetaDtoToResponse(dto);
  }

  async searchGovVotes(
    query: PaginateQuery,
    userId?: string,
  ): Promise<PaginatedResponse<VoteResponse>> {
    const votesPaginatedDto = await this.governanceService.searchGovVotes(
      query,
      userId,
    );

    const userDataMap = await this.getUserDataMap(
      votesPaginatedDto.items.map((voteDto) => {
        return voteDto.userId;
      }),
    );

    votesPaginatedDto.items.forEach((vote) => {
      vote.userName = userDataMap.get(vote.userId)?.userName;
      vote.userPhotoUrl = userDataMap.get(vote.userId)?.photoUrl;
    });

    return new PaginationDtoMapper<VoteDto, VoteResponse>().dtoToResponse(
      votesPaginatedDto,
      GovernanceMapper.voteDtoToResponse,
    );
  }

  private async getUserDataMap(
    ids: string[],
  ): Promise<Map<string, UserPhotoDto>> {
    const userDtos = await this.usersService.findMultipleByIds(ids);
    return new Map(
      userDtos.map((user) => {
        return [user.id, new UserPhotoDto(user.name, user.profilePhotoUrl)];
      }),
    );
  }
}
