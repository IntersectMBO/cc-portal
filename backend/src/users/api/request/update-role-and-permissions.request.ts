import { RoleEnum } from 'src/users/enums/role.enum';
import { PermissionEnum } from 'src/users/enums/permission.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsEnum, IsIn } from 'class-validator';

export class UpdateRoleAndPermissionsRequest {
  @ApiProperty({
    description: 'New role of the user',
    example: 'admin',
    name: 'new_role',
  })
  @IsIn([RoleEnum.USER, RoleEnum.ADMIN])
  newRole: string;

  @ApiProperty({
    description: 'New list of permissions for the user (optional)',
    example: ['manage_cc_members'],
    required: false,
    name: 'new_permissions',
  })
  @IsArray()
  @IsEnum(PermissionEnum, { each: true })
  @ArrayUnique({ message: 'Permissions must be unique' })
  newPermissions?: string[] = [];
}
