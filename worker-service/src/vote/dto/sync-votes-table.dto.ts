import { Timestamp } from 'typeorm';

export class SyncVotesTableDto {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  hotAddress: string;
  govActionProposalId: string;
  vote: string;
  title: string;
  comment: string;
  type: string;
  endTime: Timestamp;
  time: Timestamp;
}
