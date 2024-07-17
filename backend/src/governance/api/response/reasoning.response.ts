import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReasoningResponse {
  @ApiProperty({
    description: 'CID related to a deployed rationale',
    example: 'bafkreib3vbnwp6gvmtj2gktw24ywl7bgq4ecsacmecuioqjpszvh2hjfba',
  })
  @Expose({ name: 'cid' })
  cid: string;

  @ApiProperty({
    description: 'Ipfs URL of the document',
    example:
      'https://ipfs.io/ipfs/QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n',
  })
  @Expose({ name: 'url' })
  url: string;

  @ApiProperty({
    description: 'blake2b is hash of the content',
    example: '1db47bc986861479b0bcc00e4320a6b5748ad4506716295f815d66e355df04fa',
  })
  @Expose({ name: 'blake2b' })
  blake2b: string;

  @ApiProperty({ description: 'Contents of a rationale in json format' })
  @Expose({ name: 'contents' })
  contents: string;
}
