import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GovActionProposalStatus } from 'src/governance/enums/gov-action-proposal-status.enum';
import { VoteStatus } from 'src/governance/enums/vote-status.enum';

export class GovernanceActionProposalSearchResponse {
  @ApiProperty({
    description: 'Unique governance proposal ID',
    example: '1',
  })
  @Expose({ name: 'id' })
  id: string;

  @ApiProperty({
    description: 'Governance action proposal TX hash,',
    example:
      '28a5c50e900fbc155a98d78d2081e49ca4d6f004f2604e758a64357119db1b05#0',
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
    description: 'Type of a governance action proposal',
    example: 'InfoAction',
  })
  @Expose({ name: 'type' })
  type: string;

  @ApiProperty({
    description: 'Metadata URL of a governance action proposal',
    example: 'https://some.random.url',
  })
  @Expose({ name: 'metadata_url' })
  metadataUrl: string;

  @ApiProperty({
    description:
      'Returns whether this governance action proposal is already resolved (if resolved, cc member should not have an option to manage his vote)',
    example: 'EXPIRED',
  })
  @Expose({ name: 'status' })
  status: GovActionProposalStatus;

  @ApiProperty({
    description:
      'Returns whether there is off-chain CC Portal managed reasoning related to a vote for a given governance action proposal for a particular user',
    example: 'false',
  })
  @Expose({ name: 'has_reasoning' })
  hasReasoning: boolean;

  @ApiProperty({
    description:
      'Vote Status for a Given governance action proposal for a particular user.',
    example: 'Pending',
  })
  @Expose({ name: 'vote_status' })
  voteStatus: VoteStatus;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    description: 'Submit time of a governance action proposal',
  })
  @Expose({ name: 'submit_time' })
  submitTime: Date;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    description: 'End time of a governance proposal',
  })
  @Expose({ name: 'end_time' })
  endTime: Date;
}
