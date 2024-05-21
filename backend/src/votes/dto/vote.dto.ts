import { VoteValues } from 'src/votes/enums/vote-values.enum';
import { Timestamp } from 'typeorm';

export class VoteDto {
  id: string;
  userId: string;
  userName: string;
  userAddress: string;
  voteValue: VoteValues;
  reasoningTitle: string;
  comment: string;
  govProposalType: string;
  govProposalResolved: boolean;
  govProposalEndTime: Timestamp;
  voteSubmitTime: Timestamp;
}
