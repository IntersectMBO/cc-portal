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
import { GovernanceActionProposalResponse } from '../api/response/gov-action-proposal.response';
import { GovernanceActionProposalSearchResponse } from '../api/response/gov-action-proposal-search.response';
import { RationaleResponse } from '../api/response/rationale.response';
import { IpfsService } from 'src/ipfs/services/ipfs.service';
import { RationaleRequest } from '../api/request/rationale.request';
import { IpfsContentDto } from 'src/ipfs/dto/ipfs-content.dto';
import { GovActionProposalDto } from '../dto/gov-action-proposal-dto';

@Injectable()
export class GovernanceFacade {
  private logger = new Logger(GovernanceFacade.name);

  constructor(
    private readonly governanceService: GovernanceService,
    private readonly usersService: UsersService,
    private readonly ipfsService: IpfsService,
  ) {}

  async addRationale(
    userId: string,
    proposalId: string,
    rationaleRequest: RationaleRequest,
  ): Promise<RationaleResponse> {
    const govActionDto =
      await this.governanceService.findGovProposalById(proposalId);
    const rationaleJson = await this.createRationaleJson(
      rationaleRequest,
      govActionDto,
    );
    const ipfsContentDto = await this.addRationaleToIpfs(rationaleJson);
    const rationaleDto = GovernanceMapper.ipfsContentDtoToRationaleDto(
      ipfsContentDto,
      userId,
      proposalId,
      rationaleRequest,
    );
    const response = await this.governanceService.addRationale(rationaleDto);
    return GovernanceMapper.rationaleDtoToResponse(response);
  }

  private async createRationaleJson(
    rationaleRequest: RationaleRequest,
    govActionDto: GovActionProposalDto,
  ): Promise<string> {
    const rationaleJson = {
      govActionProposalTxHash: govActionDto.txHash,
      title: rationaleRequest.title,
      content: rationaleRequest.content,
    };
    return JSON.stringify(rationaleJson);
  }

  private async addRationaleToIpfs(
    rationaleJson: string,
  ): Promise<IpfsContentDto> {
    const ipfsContentDto =
      await this.ipfsService.addRationaleToIpfs(rationaleJson);
    return ipfsContentDto;
  }

  async getRationale(
    userId: string,
    proposalId: string,
  ): Promise<RationaleResponse> {
    const response =
      await this.governanceService.findRationaleForUserByProposalId(
        userId,
        proposalId,
      );
    return GovernanceMapper.rationaleDtoToResponse(response);
  }

  async findGovActionProposalById(
    id: string,
  ): Promise<GovernanceActionProposalResponse> {
    const dto = await this.governanceService.findGovProposalById(id);
    return GovernanceMapper.govActionProposalDtoToResponse(dto);
  }

  async searchGovActionProposals(
    query: PaginateQuery,
    userId: string,
  ): Promise<PaginatedResponse<GovernanceActionProposalSearchResponse>> {
    const gapPaginatedDto =
      await this.governanceService.searchGovActionProposals(query, userId);

    return new PaginationDtoMapper<
      GovActionProposalDto,
      GovernanceActionProposalSearchResponse
    >().dtoToResponse(
      gapPaginatedDto,
      GovernanceMapper.govActionProposalDtoToSearchResponse,
    );
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
