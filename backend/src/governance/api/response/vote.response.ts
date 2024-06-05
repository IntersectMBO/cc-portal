import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GovActionProposalStatus } from 'src/governance/enums/gov-action-proposal-status.enum';
import { VoteValue } from 'src/governance/enums/vote-value.enum';

export class VoteResponse {
  @ApiProperty({
    description: 'Name of the user that voted',
    example: 'John Doe',
  })
  @Expose({ name: 'user_name' })
  userName: string;

  @ApiProperty({
    description:
      'Address of a user that voted (can be one either his current or previous hot address)',
    example: 'Ae2tdPwUPEZKyArxpKiJu9qDf4yrBb8mJc6aNqiNi72NqRkJKTmCXHJqWVE',
  })
  @Expose({ name: 'user_address' })
  userAddress: string;

  @ApiProperty({
    description: 'URL of a photo related to a user',
    example: 'http://imgpost.com/abc123',
  })
  @Expose({ name: 'user_photo_url' })
  userPhotoUrl: string;

  @ApiProperty({
    description: 'Value of a vote - can be either yes, no or abstain',
    type: VoteValue,
  })
  @Expose({ name: 'value' })
  voteValue: VoteValue;

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
  @Expose({ name: 'reasoning_comment' })
  reasoningComment: string;

  @ApiProperty({
    description: 'Returns an id of a governance proposal related to a vote',
    example: '123',
  })
  @Expose({ name: 'gov_action_proposal_id' })
  govProposalId: number;

  @ApiProperty({
    description: 'Returns a title of governance proposal related to a vote',
    example: 'Random title',
  })
  @Expose({ name: 'gov_action_proposal_title' })
  govProposalTitle: string;

  @ApiProperty({
    description:
      'Returns a specific type of a governance proposal to which this vote is related',
    example: 'ParameterChange',
  })
  @Expose({ name: 'gov_action_proposal_type' })
  govProposalType: string;

  @ApiProperty({
    description:
      'Returns whether this governance proposal is already resolved (if resolved, cc member should not have an option to manage his vote)',
    example: 'false',
  })
  @Expose({ name: 'gov_action_proposal_status' })
  govProposalStatus: GovActionProposalStatus;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    description: 'End time of a governance proposal',
  })
  @Expose({ name: 'gov_action_proposal_end_time' })
  govProposalEndTime: Date;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    description: 'Submit time of this particular vote',
  })
  @Expose({ name: 'vote_submit_time' })
  voteSubmitTime: Date;
}
