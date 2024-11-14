import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class RationaleRequest {
  @ApiProperty({ description: 'Summary' })
  @MaxLength(200, { message: `Maximum character length is 200` })
  @IsString()
  summary: string;

  @ApiProperty({ description: 'Rationale statement' })
  @IsString()
  rationaleStatement: string;
}
