import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { PermissionEnum } from 'src/users/enums/permission.enum';

export class CreateAdminRequest {
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
  @ArrayMinSize(1, { message: 'At least one permission is required' })
  @ArrayUnique({ message: 'Permissions must be unique' })
  permissions: string[];
}
