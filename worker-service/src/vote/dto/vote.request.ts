export class VoteRequest {
  id: string;
  hotAddress: string;
  userId: string;
  govActionProposalId: string;
  votingAnchorId: string;
  vote: string;
  title: string;
  comment: string;
  govActionType: string;
  endTime: number;
  submitTime: number;
  govMetadataUrl: string;
}
