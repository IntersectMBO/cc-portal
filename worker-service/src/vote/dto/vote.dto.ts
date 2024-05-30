import { Timestamp } from 'typeorm';

export class VoteDto {
  id: string;
  userId: string;
  hotAddress: string;
  govActionProposalId: string;
  vote: string;
  title: string;
  comment: string;
  govActionType: string;
  endTime: Date;
  submitTime: Date;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
