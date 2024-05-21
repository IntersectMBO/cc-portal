import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { VoteValues } from 'src/votes/enums/vote-values.enum';
import { Timestamp } from 'typeorm';

export class VoteResponse {
  @ApiProperty({
    description: 'Unique vote ID',
    example: '7ceb9ab7-6427-40b7-be2e-37ba6742d5fd',
  })
  @Expose({ name: 'id' })
  id: string;

  @ApiProperty({
    description: 'Name of the user that voted',
    example: 'John Doe',
  })
  @Expose({ name: 'user_name' })
  userName: string;

  @ApiProperty({
    description:
      'Address of a user that voted (can be one either his current or previous hot address)',
    example: 'sofija@example.com',
  })
  @Expose({ name: 'user_address' })
  userAddress: string;

  @ApiProperty({
    description: 'Value of a vote - can be either yes, no or abstain',
    type: VoteValues,
  })
  @Expose({ name: 'value' })
  voteValue: VoteValues;

  @ApiProperty({
    description: 'Gives an on chain reasoning title related to a vote',
    example: 'This proposal is good for the ecosystem',
  })
  @Expose({ name: 'reasoning_title' })
  reasoningTitle: string;

  @ApiProperty({
    description: 'Gives an on chain reasoning comment related to a vote',
    example: 'Here i elaborated why this proposal is good for the ecosystem',
  })
  @Expose({ name: 'comment' })
  comment: string;

  @ApiProperty({
    description:
      'Returns a specific type of a governance proposal to which this vote is related',
    example: 'ParameterChange',
  })
  @Expose({ name: 'governance_proposal_type' })
  govProposalType: string;

  @ApiProperty({
    description:
      'Returns whether this governance proposal is already resolved (if resolved, cc member should not have an option to manage his vote)',
    example: 'false',
  })
  @Expose({ name: 'governance_proposal_resolved' })
  govProposalResolved: boolean;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    description: 'End time of a governance proposal',
  })
  @Expose({ name: 'governance_proposal_end_time' })
  govProposalEndTime: Timestamp;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    description: 'Submit time of this particular vote',
  })
  @Expose({ name: 'vote_submit_time' })
  voteSubmitTime: Timestamp;
}
