import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';
import { UserStatusEnum } from 'src/users/enums/user-status.enum';

export class ToggleStatusRequest {
  @ApiProperty({
    description: 'Identification number of the user',
    example: '82dbbfb1-2552-4aaf-a9a7-1195497410c0',
    name: 'user_id',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description:
      'Field to indicate if the status relative to the request should be active or inactive',
    example: UserStatusEnum.INACTIVE,
    name: 'status',
  })
  @IsIn([UserStatusEnum.ACTIVE, UserStatusEnum.INACTIVE])
  status: UserStatusEnum;
}
