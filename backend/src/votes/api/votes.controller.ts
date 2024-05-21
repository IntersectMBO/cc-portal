import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PaginationResponse } from '../../util/pagination/response/pagination.response';
import { SortOrder } from '../../util/pagination/enums/sort-order.enum';
import { VotesFacade } from '../facade/votes.facade';
import { VoteResponse } from './response/vote.response';
import { SearchPhrasePipe } from 'src/util/pagination/pipe/search-phrase.pipe';
import { SortOrderPipe } from 'src/util/pagination/pipe/sort-order.pipe';
import { SearchQueryDto } from 'src/util/pagination/dto/search-query.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UserPathGuard } from 'src/auth/guard/users-path.guard';
@ApiTags('Votes')
@Controller('votes')
export class VotesController {
  constructor(private readonly votesFacade: VotesFacade) {}

  /**
   * Search endpoint for Votes;
   * Returns all votes according to search criteria;
   * This is a public endpoint
   **/
  @ApiOperation({ summary: 'List of votes' })
  @ApiResponse({
    status: 200,
    description: 'Votes',
    isArray: true,
    type: PaginationResponse<VoteResponse>,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page that is selected by user, accepts numbers',
    type: Number,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    description: 'Number of votes shown on a page.',
    type: Number,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description:
      'Sort order parameter - can be either ASC (Ascending) or DESC (Descending)',
    enum: SortOrder,
  })
  @ApiQuery({
    name: 'phrase',
    required: false,
    description: 'A search phrase related to user name, does not accept * or ;',
    type: String,
  })
  @Get('search')
  async searchVotes(
    @Query('phrase', SearchPhrasePipe) searchPhrase: string,
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 12,
    @Query('order', SortOrderPipe) order: SortOrder = SortOrder.DESC,
  ): Promise<PaginationResponse<VoteResponse>> {
    const searchQuery = new SearchQueryDto(searchPhrase, page, perPage, order);
    return await this.votesFacade.searchVotes(searchQuery);
  }

  /**
   * Search endpoint for Votes related to a user that made a request;
   * This is a protected endpoint
   **/
  @ApiOperation({ summary: 'List of my votes' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Votes',
    isArray: true,
    type: PaginationResponse<VoteResponse>,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page that is selected by user, accepts numbers',
    type: Number,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    description: 'Number of votes shown on a page.',
    type: Number,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description:
      'Sort order parameter - can be either ASC (Ascending) or DESC (Descending)',
    enum: SortOrder,
  })
  @ApiQuery({
    name: 'phrase',
    required: false,
    description: 'A search phrase related to user name, does not accept * or ;',
    type: String,
  })
  @Get(':id/search')
  @UseGuards(JwtAuthGuard, UserPathGuard)
  async searchMyVotes(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('phrase', SearchPhrasePipe) searchPhrase: string,
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 12,
    @Query('order', SortOrderPipe) order: SortOrder = SortOrder.DESC,
  ): Promise<PaginationResponse<VoteResponse>> {
    const searchQuery = new SearchQueryDto(searchPhrase, page, perPage, order);

    return await this.votesFacade.searchVotes(searchQuery, id);
  }
}
