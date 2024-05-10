import { ApiProperty } from '@nestjs/swagger';
import { PageParameters } from '../interfaces/page-parameters.interface';

export class PageMetaResponse {
  @ApiProperty({
    description: 'Current page',
    example: 3,
  })
  page: number;

  @ApiProperty({
    description: 'Number of users per page',
    example: 12,
  })
  perPage: number;

  @ApiProperty({
    description: 'Total number of users',
    example: 30,
  })
  itemCount: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3,
  })
  pageCount: number;

  @ApiProperty({
    description: 'Shows if there is a page before current',
    example: true,
  })
  hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Shows if there is a page after current',
    example: false,
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
