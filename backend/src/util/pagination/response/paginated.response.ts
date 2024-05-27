import { ApiProperty } from '@nestjs/swagger';
import { PageMetaResponse } from './page-meta.response';
import { IsArray } from 'class-validator';
import { Expose } from 'class-transformer';

export class PaginatedResponse<T> {
  @IsArray()
  @ApiProperty({ type: () => [Object] })
  @Expose({
    name: 'data',
  })
  data: T[];

  @ApiProperty({ type: () => PageMetaResponse })
  @Expose({
    name: 'meta',
  })
  meta: PageMetaResponse;

  constructor(data: T[], meta: PageMetaResponse) {
    this.data = data;
    this.meta = meta;
  }
}
