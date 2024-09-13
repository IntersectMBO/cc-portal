import { GovActionProposalStatus } from '../enums/gov-action-proposal-status.enum';
import { VoteStatus } from '../enums/vote-status.enum';

export class GovActionProposalDto {
  id: string;
  txHash: string;
  title: string;
  abstract: string;
  metadataUrl: string;
  type: string;
  status: GovActionProposalStatus;
  voteStatus: VoteStatus;
  hasRationale: boolean;
  votedBy: string[];
  rationaleBy: string[];
  submitTime: Date;
  endTime: Date;
}

export class VoteStatusRationaleInfoDto {
  constructor(voteStatus: VoteStatus, hasRationale: boolean) {
    this.voteStatus = voteStatus;
    this.hasRationale = hasRationale;
  }
  voteStatus: VoteStatus;
  hasRationale: boolean;
}
