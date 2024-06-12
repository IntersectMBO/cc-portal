import { VoteValue } from 'src/governance/enums/vote-value.enum';
import { GovActionProposalStatus } from '../enums/gov-action-proposal-status.enum';

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
  govProposalStatus: GovActionProposalStatus;
  govProposalEndTime: Date;
  voteSubmitTime: Date;
}
