import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReasoningRequest {
  @ApiProperty({ description: 'Reasoning title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Reasoning content' })
  @IsString()
  content: string;
}
