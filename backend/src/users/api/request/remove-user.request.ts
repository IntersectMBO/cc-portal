import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RemoveUserRequest {
  @ApiProperty({
    description: 'Identification number of the user',
    example: '82dbbfb1-2552-4aaf-a9a7-1195497410c0',
    name: 'user_id',
  })
  @IsUUID()
  userId: string;
}
