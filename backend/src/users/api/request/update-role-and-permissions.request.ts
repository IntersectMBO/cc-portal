import { RoleEnum } from 'src/users/enums/role.enum';
import { PermissionEnum } from 'src/users/enums/permission.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';

export class UpdateRoleAndPermissionsRequest {
  @ApiProperty({
    description: 'New role of the user',
    example: 'ADMIN',
  })
  @IsEnum(RoleEnum)
  newRole: string;

  @ApiProperty({
    description: 'New list of permissions for the user (optional)',
    example: ['add_constitution_version'],
    required: false,
  })
  @IsArray()
  @IsEnum(PermissionEnum, { each: true })
  newPermissions?: string[] = [];
}
