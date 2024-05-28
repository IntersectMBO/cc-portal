import { Timestamp } from 'typeorm';

export class VoteDto {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  id: string;
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
