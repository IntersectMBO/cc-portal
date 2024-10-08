import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RationaleRequest {
  @ApiProperty({ description: 'Rationale title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Rationale content' })
  @IsString()
  content: string;
}
