export class GovActionProposalDto {
  id: string;
  votingAnchorId: string;
  govTitle: string;
  abstract: string;
  govActionType: string;
  govMetadataUrl: string;
  status: string;
  endTime: Date;
  txHash: string;
}
