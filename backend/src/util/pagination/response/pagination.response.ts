import { ApiProperty } from '@nestjs/swagger';
import { PageMetaResponse } from './page-meta.response';
import { IsArray } from 'class-validator';

export class PaginationResponse<T> {
  @IsArray()
  @ApiProperty({ type: () => [Object] })
  data: T[];

  @ApiProperty({ type: () => PageMetaResponse })
  meta: PageMetaResponse;

  constructor(data: T[], meta: PageMetaResponse) {
    this.data = data;
    this.meta = meta;
  }
}
