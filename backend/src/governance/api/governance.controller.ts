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
import { GovernanceActionMetadataResponse } from './response/gov-action-metadata.response';
import { ReasoningRequest } from './request/reasoning.request';
import { ReasoningResponse } from './response/reasoning.response';
@ApiTags('Governance')
@Controller('governance')
export class GovernanceController {
  constructor(private readonly governanceFacade: GovernanceFacade) {}

  @ApiOperation({ summary: 'Find Governance Action proposal metadata by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returned GAP metadata',
    type: GovernanceActionMetadataResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Governance action proposal with {id} not found',
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GovernanceActionMetadataResponse> {
    return await this.governanceFacade.findGovActionProposalById(id);
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
  @Get('votes/users/:id/search')
  @UseGuards(JwtAuthGuard, UserPathGuard)
  async searchUserActivityPaginated(
    @Param('id', ParseUUIDPipe) id: string,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<VoteResponse>> {
    return await this.governanceFacade.searchGovVotes(query, id);
  }

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
  @Post('reasoning/users/:id')
  async addReasoning(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() reasoningRequest: ReasoningRequest,
  ): Promise<ReasoningResponse> {
    return await this.governanceFacade.addReasoning(id, reasoningRequest);
  }
}
