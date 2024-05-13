import { ApiProperty } from '@nestjs/swagger';
import { PageParameters } from '../interfaces/page-parameters.interface';
import { Expose } from 'class-transformer';

export class PageMetaResponse {
  @ApiProperty({
    description: 'Current page',
    example: 3,
  })
  @Expose({
    name: 'page',
  })
  page: number;

  @ApiProperty({
    description: 'Number of users per page',
    example: 12,
  })
  @Expose({
    name: 'per_page',
  })
  perPage: number;

  @ApiProperty({
    description: 'Total number of users',
    example: 30,
  })
  @Expose({
    name: 'item_count',
  })
  itemCount: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3,
  })
  @Expose({
    name: 'page_count',
  })
  pageCount: number;

  @ApiProperty({
    description: 'Shows if there is a page before current',
    example: true,
  })
  @Expose({
    name: 'has_previous_page',
  })
  hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Shows if there is a page after current',
    example: false,
  })
  @Expose({
    name: 'has_next_page',
  })
  hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageParameters) {
    this.page = pageOptionsDto.page;
    this.perPage = pageOptionsDto.perPage;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.perPage);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
