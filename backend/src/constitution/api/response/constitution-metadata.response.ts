import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ConstitutionMetadataResponse {
  @ApiProperty({
    description: 'CID related to a deployed Constitution',
    example: 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n',
  })
  @Expose({ name: 'cid' })
  cid: string;

  @ApiProperty({
    description: 'Title of the document',
    example: 'Revision 1',
  })
  @Expose({ name: 'title' })
  title: string;

  @ApiProperty({
    description: 'Version of the document',
    example: '1713153716',
  })
  @Expose({ name: 'version' })
  version: string;

  @ApiProperty({
    name: 'created_date',
    description: 'Date of uploaded document',
    example: '01.01.2024.',
  })
  @Expose({ name: 'created_date' })
  createdDate: string;
}
