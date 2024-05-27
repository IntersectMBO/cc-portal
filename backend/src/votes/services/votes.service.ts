import { Injectable, Logger } from '@nestjs/common';
import { VotesPaginatedDto } from '../dto/votes-paginated.dto';
import { SearchQueryDto } from 'src/util/pagination/dto/search-query.dto';

@Injectable()
export class VotesService {
  private logger = new Logger(VotesService.name);

  constructor() {}

  searchVotes(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchQuery: SearchQueryDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userAddress?: string,
  ): Promise<VotesPaginatedDto> {
    //TODO Impl
    return null;
  }
}
