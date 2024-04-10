import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ConstitutionResponse {
  @ApiProperty({
    description: 'CID related to a deployed Constitution',
    example: 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n',
  })
  @Expose({ name: 'cid' })
  cid: string;

  @ApiProperty({ description: 'Contents of a constitution file' })
  @Expose({ name: 'contents' })
  contents: string;
}
