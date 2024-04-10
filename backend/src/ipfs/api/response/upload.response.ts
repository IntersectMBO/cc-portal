import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UploadResponse {
  @ApiProperty({
    description: 'Content ID of the document',
    example: 'bafybeicag43s3natg6b4itbvhf7rk45ejcsoaxs5f2lhshrozmp7yaj4oy',
  })
  @Expose({ name: 'cid' })
  cid: string;
}
