import { VoteValue } from 'src/governance/enums/vote-value.enum';
import { GovActionProposalStatus } from '../enums/gov-action-proposal-status.enum';

export class VoteDto {
  id: string;
  userId: string;
  userName: string;
  userAddress: string;
  userPhotoUrl: string;
  voteValue: VoteValue;
  rationaleTitle: string;
  rationaleComment: string;
  govActionProposalId: string;
  govActionProposalTxHash: string;
  govActionProposalTitle: string;
  govActionProposalType: string;
  govActionProposalStatus: GovActionProposalStatus;
  govActionProposalEndTime: Date;
  voteSubmitTime: Date;
}
