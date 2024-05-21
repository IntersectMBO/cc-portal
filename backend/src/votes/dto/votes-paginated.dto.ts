import { VoteDto } from './vote.dto';

export class VotesPaginatedDto {
  voteDtos: VoteDto[];
  itemCount: number;
}
