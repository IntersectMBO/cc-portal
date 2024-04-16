import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ConstitutionDiffResponse {
  //TODO Add valid information about fields
  @ApiProperty({
    description: 'CID related to a deployed Constitution',
    example: 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n',
  })
  @Expose({ name: 'base' })
  base: string;

  @ApiProperty({
    description: 'CID related to a deployed Constitution',
    example: 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n',
  })
  @Expose({ name: 'target' })
  target: string;

  @ApiProperty({ description: 'Contents of a diff' })
  @Expose({ name: 'diff' })
  diff: string;
}
