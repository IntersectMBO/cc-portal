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
    description: 'Blake2b hash related to a deployed Constitution',
    example: 'd9eeada848e4ffcbbb1be73421b47a960885954548aa44b2d46b2d84fb99141c',
  })
  @Expose({ name: 'blake2b' })
  blake2b: string;

  @ApiProperty({
    description: 'Ipfs URL of the document',
    example:
      'https://ipfs.io/ipfs/QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n',
  })
  @Expose({ name: 'url' })
  url: string;

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
