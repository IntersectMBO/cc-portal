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
import { GovernanceActionProposalResponse } from '../api/response/gov-action-proposal.response';
import { ReasoningResponse } from '../api/response/reasoning.response';
import { IpfsService } from 'src/ipfs/services/ipfs.service';
import { ReasoningRequest } from '../api/request/reasoning.request';
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

  async addReasoning(
    userId: string,
    proposalId: string,
    reasoningRequest: ReasoningRequest,
  ): Promise<ReasoningResponse> {
    const govActionDto =
      await this.governanceService.findGovProposalById(proposalId);
    const reasoningJson = await this.createReasoningJson(
      reasoningRequest,
      govActionDto,
    );
    const ipfsContentDto = await this.addReasoningToIpfs(reasoningJson);
    const reasoningDto = GovernanceMapper.ipfsContentDtoToReasoningDto(
      ipfsContentDto,
      userId,
      reasoningRequest,
    );
    const response = await this.governanceService.addReasoning(reasoningDto);
    return GovernanceMapper.reasoningDtoToResponse(response);
  }

  private async createReasoningJson(
    reasoningRequest: ReasoningRequest,
    govActionDto: GovActionProposalDto,
  ): Promise<string> {
    const reasoningJson = {
      govActionProposalHash: govActionDto.hash,
      title: reasoningRequest.title,
      content: reasoningRequest.content,
    };
    return JSON.stringify(reasoningJson);
  }

  private async addReasoningToIpfs(
    reasoningJson: string,
  ): Promise<IpfsContentDto> {
    const ipfsContentDto =
      await this.ipfsService.addReasoningToIpfs(reasoningJson);
    return ipfsContentDto;
  }

  async getReasoning(
    userId: string,
    proposalId: string,
  ): Promise<ReasoningResponse> {
    const response =
      await this.governanceService.findReasoningForUserByProposalId(
        userId,
        proposalId,
      );
    return GovernanceMapper.reasoningDtoToResponse(response);
  }

  async findGovActionProposalById(
    id: string,
  ): Promise<GovernanceActionMetadataResponse> {
    const dto = await this.governanceService.findGovProposalById(id);
    return GovernanceMapper.govActionMetaDtoToResponse(dto);
  }

  async searchGovActionProposals(
    query: PaginateQuery,
    userId: string,
  ): Promise<PaginatedResponse<GovernanceActionProposalResponse>> {
    //TODO Impl
    return null;
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
