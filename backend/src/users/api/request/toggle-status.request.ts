import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { UserStatusEnum } from 'src/users/enums/user-status.enum';

export class ToggleStatusRequest {
  @ApiProperty({
    description:
      'Field to indicate if the status relative to the request should be active or inactive',
    example: UserStatusEnum.INACTIVE,
    name: 'status',
  })
  @IsIn([UserStatusEnum.ACTIVE, UserStatusEnum.INACTIVE])
  status: UserStatusEnum;
}
