import { Timestamp } from 'typeorm';
import { Vote } from '../../vote/entities/vote.entity';

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
  submitTime: Date;
  votes: Vote[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
