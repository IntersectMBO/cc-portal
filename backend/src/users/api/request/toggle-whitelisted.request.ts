import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ToggleWhitelistedRequest {
  @ApiProperty({
    description:
      'Flag to indicate if the status relative to request should be enabled or not',
    example: true,
    name: 'whitelisted',
  })
  @IsBoolean()
  whitelisted: boolean;
}
