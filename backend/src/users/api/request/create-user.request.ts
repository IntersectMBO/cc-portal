import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, MaxLength } from 'class-validator';
import { PermissionEnum } from '../../enums/permission.enum';

export class CreateUserRequest {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @MaxLength(80, { message: `Maximum character length is 80` })
  @IsEmail()
  destination: string;

  @ApiProperty({
    description: 'List of permissions of the user',
    example: ['add_constitution_version'],
  })
  @IsArray()
  @IsEnum(PermissionEnum, { each: true })
  permissions?: string[] = [];
}
