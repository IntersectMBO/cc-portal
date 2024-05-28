import { Timestamp } from 'typeorm';

export class VoteRequestDto {
  userId: string;
  hotAddress: string;
  govActionProposalId: string;
  vote: string;
  title: string;
  comment: string;
  type: string;
  govMetadataUrl: string;
  endTime: Timestamp;
  time: Timestamp;
}
