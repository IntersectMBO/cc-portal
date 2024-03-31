import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, MaxLength } from 'class-validator';
import { PermissionAdminEnum } from 'src/users/entities/permission.entity';
import { RoleEnum } from 'src/users/entities/role.entity';

export class CreateUserRequest {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @MaxLength(80, { message: `Maximum character length is 80` })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'List of roles of the user',
    example: ['user'],
  })
  @IsArray()
  @IsEnum(RoleEnum, { each: true })
  roles: string[];

  @ApiProperty({
    description: 'List of permissions of the user',
    example: ['add_constitution_version'],
  })
  @IsArray()
  @IsEnum(PermissionAdminEnum, { each: true })
  permissions: string[];
}
