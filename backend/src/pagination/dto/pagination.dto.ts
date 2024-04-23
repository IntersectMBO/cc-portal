import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './page-meta.dto';
import { IsArray } from 'class-validator';

export class PaginationDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
