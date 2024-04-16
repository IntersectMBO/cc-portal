import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DocResponse {
  @ApiProperty({
    description: 'Content ID',
    example: 'bafkreieb7d76kkk4pszhncubgtdcd2nm5rkz3u5ydanju7253o5fxl2o7e',
  })
  @Expose({ name: 'cid' })
  cid: string;

  @ApiProperty({
    description: 'Content of the document',
    example:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
  })
  @Expose({ name: 'content' })
  content: string;

  @ApiProperty({
    description: 'Version of the document',
    example: '1.0.0',
  })
  @Expose({ name: 'version' })
  version: string;
}
