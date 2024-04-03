import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, MaxLength } from 'class-validator';
import { PermissionAdminEnum } from 'src/users/enums/permission.enum';
import { RoleEnum } from 'src/users/enums/role.enum';

export class CreateUserRequest {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @MaxLength(80, { message: `Maximum character length is 80` })
  @IsEmail()
  destination: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'user',
  })
  @IsEnum(RoleEnum)
  role: string;

  @ApiProperty({
    description: 'List of permissions of the user',
    example: ['add_constitution_version'],
  })
  @IsArray()
  @IsEnum(PermissionAdminEnum, { each: true })
  permissions?: string[] = [];
}
