import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SearchRequest {
  @ApiProperty({
    description: 'The way of sorting users',
    example: 'asc',
  })
  @IsString()
  sortOrder: string;
}
