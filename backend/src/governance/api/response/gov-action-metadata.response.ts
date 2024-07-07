import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GovActionProposalStatus } from 'src/governance/enums/gov-action-proposal-status.enum';

export class GovernanceActionMetadataResponse {
  @ApiProperty({
    description: 'Unique governance proposal ID',
    example: '1',
  })
  @Expose({ name: 'id' })
  id: string;

  @ApiProperty({
    description: 'Unique governance proposal transaction hash',
    example: '1',
  })
  @Expose({ name: 'tx_hash' })
  txHash: string;

  @ApiProperty({
    description: 'Title of a governance action proposal',
    example: 'Random title',
  })
  @Expose({ name: 'title' })
  title: string;

  @ApiProperty({
    description: 'Abstract of a governance action proposal',
    example:
      'This is a random abstract of a governance action proposal abstract. No longer than 2500 chars',
  })
  @Expose({ name: 'abstract' })
  abstract: string;

  @ApiProperty({
    description: 'Metadata URL of a governance action proposal',
    example: 'https://some.random.url',
  })
  @Expose({ name: 'metadata_url' })
  metadataUrl: string;

  @ApiProperty({
    description:
      'Returns whether this governance proposal is already resolved (if resolved, cc member should not have an option to manage his vote)',
    example: 'EXPIRED',
  })
  @Expose({ name: 'gov_action_proposal_status' })
  status: GovActionProposalStatus;

  @ApiProperty({
    description:
      'Returns a specific type of a governance proposal to which this vote is related',
    example: 'ParameterChange',
  })
  @Expose({ name: 'gov_action_type' })
  govActionType: string;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    description: 'End time of a governance proposal',
  })
  @Expose({ name: 'end_time' })
  endTime: Date;
}
