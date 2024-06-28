export class VoteRequest {
  id: string;
  hotAddress: string;
  userId: string;
  govActionProposalId: string;
  vote: string;
  reasoningTitle: string;
  comment: string;
  submitTime: number;
  votingAnchorId: string;
  govActionType: string;
  govMetadataUrl: string;
  status: string;
  endTime: Date;
  txHash: string;
}
