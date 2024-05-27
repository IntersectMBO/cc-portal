import { Injectable, Logger } from '@nestjs/common';
import { PaginateQuery } from 'nestjs-paginate';
import { VoteDto } from '../dto/vote.dto';
import { PaginatedDto } from 'src/util/pagination/dto/paginated.dto';

@Injectable()
export class VotesService {
  private logger = new Logger(VotesService.name);

  constructor() {}

  searchVotes(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query: PaginateQuery,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userAddress?: string,
  ): Promise<PaginatedDto<VoteDto>> {
    //TODO Impl - see search from vote service
    return null;
  }
}
