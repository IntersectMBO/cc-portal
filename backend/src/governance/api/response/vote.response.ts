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
    description: 'Gives an on chain rationale title related to a vote',
    example: 'This proposal is good for the ecosystem',
  })
  @Expose({ name: 'rationale_title' })
  rationaleTitle: string;

  @ApiProperty({
    description: 'Gives an on chain rationale comment related to a vote',
    example: 'Here i elaborated why this proposal is good for the ecosystem',
  })
  @Expose({ name: 'rationale_comment' })
  rationaleComment: string;

  @ApiProperty({
    description:
      'Returns an id of a governance action proposal related to a vote',
    example: '123',
  })
  @Expose({ name: 'gov_action_proposal_id' })
  govActionProposalId: string;

  @ApiProperty({
    description:
      'Returns a tx hash of a governance action proposal related to a vote',
    example:
      '28a5c50e900fbc155a98d78d2081e49ca4d6f004f2604e758a64357119db1b05#0',
  })
  @Expose({ name: 'gov_action_proposal_tx_hash' })
  govActionProposalTxHash: string;

  @ApiProperty({
    description:
      'Returns a title of governance action proposal related to a vote',
    example: 'Random title',
  })
  @Expose({ name: 'gov_action_proposal_title' })
  govActionProposalTitle: string;

  @ApiProperty({
    description:
      'Returns a specific type of a governance action proposal to which this vote is related',
    example: 'ParameterChange',
  })
  @Expose({ name: 'gov_action_proposal_type' })
  govActionProposalType: string;

  @ApiProperty({
    description:
      'Returns whether this governance action proposal is already resolved (if resolved, cc member should not have an option to manage his vote)',
    example: 'false',
  })
  @Expose({ name: 'gov_action_proposal_status' })
  govActionProposalStatus: GovActionProposalStatus;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    description: 'End time of a governance action proposal',
  })
  @Expose({ name: 'gov_action_proposal_end_time' })
  govActionProposalEndTime: Date;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    description: 'Submit time of this particular vote',
  })
  @Expose({ name: 'vote_submit_time' })
  voteSubmitTime: Date;
}
