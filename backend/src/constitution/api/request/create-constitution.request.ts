import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateConstitutionRequest {
  @ApiProperty({ description: 'Contents of a constitution file' })
  @Expose({ name: 'contents' })
  contents: string;
}
