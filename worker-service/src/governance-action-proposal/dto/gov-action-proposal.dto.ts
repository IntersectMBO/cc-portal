export class GovActionProposalDto {
  id: string;
  votingAnchorId: string;
  title: string;
  abstract: string;
  govActionType: string;
  govMetadataUrl: string;
  status: string;
  endTime: Date;
  txHash: string;
}
