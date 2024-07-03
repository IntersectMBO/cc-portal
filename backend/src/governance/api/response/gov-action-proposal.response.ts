import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { VoteStatus } from 'src/governance/enums/vote-status.enum';

export class GovernanceActionProposalResponse {
  @ApiProperty({
    description: 'Unique governance proposal ID',
    example: '1',
  })
  @Expose({ name: 'id' })
  id: number;

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
      'Vote Status for a Given Governance Action Proposal for a particular user.',
    example: 'Pending',
  })
  @Expose({ name: 'vote_status' })
  voteStatus: VoteStatus;
}
