import { VoteValue } from 'src/governance/enums/vote-value.enum';

export class VoteDto {
  id: string;
  userId: string;
  userName: string;
  userAddress: string;
  userPhotoUrl: string;
  voteValue: VoteValue;
  reasoningTitle: string;
  reasoningComment: string;
  govProposalId: number;
  govProposalTitle: string;
  govProposalType: string;
  govProposalResolved: boolean;
  govProposalEndTime: Date;
  voteSubmitTime: Date;
}
