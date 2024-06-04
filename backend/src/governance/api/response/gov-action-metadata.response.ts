import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GovernanceActionMetadataResponse {
  @ApiProperty({
    description: 'Unique governance proposal ID',
    example: '7ceb9ab7-6427-40b7-be2e-37ba6742d5fd',
  })
  @Expose({ name: 'id' })
  id: string;

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
}
