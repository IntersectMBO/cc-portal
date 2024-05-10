import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from '../enums/sort-order.enum';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PageOptionsDto {
  //TODO list-of-cc-members do we need ApiPropertyOptional here if it is not being part of an API on Swagger? If not needed, remove ApiPropertyOptional
  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder = SortOrder.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    default: 12,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  perPage?: number = 12;

  get skip(): number {
    return (this.page - 1) * this.perPage;
  }
}
