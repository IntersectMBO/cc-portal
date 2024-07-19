import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PaginatedResponse } from '../../util/pagination/response/paginated.response';
import { GovernanceFacade } from '../facade/governance.facade';
import { VoteResponse } from './response/vote.response';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UserPathGuard } from 'src/auth/guard/users-path.guard';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { VOTE_PAGINATION_CONFIG } from '../util/pagination/votes-pagination.config';
import { GovernanceActionProposalResponse } from './response/gov-action-proposal.response';
import { GOVERNANCE_ACTION_PROPOSAL_CONFIG } from '../util/pagination/gap-pagination.config';
import { GovernanceActionProposalSearchResponse } from './response/gov-action-proposal-search.response';
import { ReasoningRequest } from './request/reasoning.request';
import { ReasoningResponse } from './response/reasoning.response';
import { ApiConditionalExcludeEndpoint } from 'src/common/decorators/api-conditional-exclude-endpoint.decorator';
@ApiTags('Governance')
@Controller('governance')
export class GovernanceController {
  constructor(private readonly governanceFacade: GovernanceFacade) {}

  @ApiOperation({ summary: 'Find Governance Action proposal by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returned Governance Action Proposal metadata',
    type: GovernanceActionProposalResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Governance action proposal with {id} not found',
  })
  @Get('proposals/:id')
  async findOne(
    @Param('id') id: string,
  ): Promise<GovernanceActionProposalResponse> {
    return await this.governanceFacade.findGovActionProposalById(id);
  }

  @ApiConditionalExcludeEndpoint()
  @ApiOperation({ summary: 'Search Governance Action Proposals' })
  @ApiBearerAuth('JWT-auth')
  @ApiPaginationQuery(GOVERNANCE_ACTION_PROPOSAL_CONFIG)
  @ApiResponse({
    status: 200,
    description:
      'Governance Action Proposals - returns GovernanceActionProposalResponse array within data',
    isArray: true,
    type: PaginatedResponse<GovernanceActionProposalSearchResponse>,
  })
  @ApiResponse({
    status: 404,
    description: 'Governance action proposal with {id} not found',
  })
  @Get('users/:id/proposals/search')
  @UseGuards(JwtAuthGuard, UserPathGuard)
  async searchGovActionProposalsPaginated(
    @Param('id', ParseUUIDPipe) id: string,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<GovernanceActionProposalSearchResponse>> {
    return await this.governanceFacade.searchGovActionProposals(query, id);
  }

  @ApiOperation({
    summary: 'List of votes related to all governance action proposals',
  })
  @ApiPaginationQuery(VOTE_PAGINATION_CONFIG)
  @ApiResponse({
    status: 200,
    description: 'Votes - returns VoteResponse array within data',
    isArray: true,
    type: PaginatedResponse<VoteResponse>,
  })
  @Get('votes/search')
  async searchVotesPaginated(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<VoteResponse>> {
    return await this.governanceFacade.searchGovVotes(query);
  }

  /**
   * Search endpoint for Votes related to a user that made a request;
   * This is a protected endpoint
   **/
  @ApiConditionalExcludeEndpoint()
  @ApiOperation({
    summary: 'List of user`s votes related to all governance action proposals',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiPaginationQuery(VOTE_PAGINATION_CONFIG)
  @ApiResponse({
    status: 200,
    description: 'Votes - returns VoteResponse array within data',
    isArray: true,
    type: PaginatedResponse<VoteResponse>,
  })
  @Get('users/:id/votes/search')
  @UseGuards(JwtAuthGuard, UserPathGuard)
  async searchUserActivityPaginated(
    @Param('id', ParseUUIDPipe) id: string,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<VoteResponse>> {
    return await this.governanceFacade.searchGovVotes(query, id);
  }

  @ApiConditionalExcludeEndpoint()
  @ApiOperation({
    summary: 'Add reasoning to governance action proposals',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: ReasoningRequest })
  @ApiResponse({
    status: 200,
    description: 'Reasoning added successfully',
    type: ReasoningResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 409,
    description: 'Reasoning already exists for this user',
  })
  @UseGuards(JwtAuthGuard, UserPathGuard)
  @Post('users/:id/proposals/:proposalId/reasoning')
  async addReasoning(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('proposalId') proposalId: string,
    @Body() reasoningRequest: ReasoningRequest,
  ): Promise<ReasoningResponse> {
    return await this.governanceFacade.addReasoning(
      id,
      proposalId,
      reasoningRequest,
    );
  }

  @ApiConditionalExcludeEndpoint()
  @ApiOperation({
    summary: 'Get my reasoning for an action proposal',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: ReasoningRequest })
  @ApiResponse({
    status: 200,
    description: 'Reasoning retrieved successfully',
    type: ReasoningResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Reasoning not found',
  })
  @UseGuards(JwtAuthGuard, UserPathGuard)
  @Get('users/:id/proposals/:proposalId/reasoning')
  async getReasoning(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('proposalId', ParseIntPipe) proposalId: string,
  ): Promise<ReasoningResponse> {
    return await this.governanceFacade.getReasoning(id, proposalId);
  }
}
