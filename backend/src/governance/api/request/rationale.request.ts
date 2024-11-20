import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RationaleRequest {
  @ApiProperty({ description: 'Summary' })
  @IsNotEmpty()
  @MaxLength(200, { message: `Maximum character length is 200` })
  @IsString()
  summary: string;

  @ApiProperty({ description: 'Rationale statement' })
  @IsNotEmpty()
  @IsString()
  rationaleStatement: string;
}
