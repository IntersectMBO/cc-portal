import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Timestamp } from 'typeorm';

export class RoleResponse {
  @ApiProperty({
    description: 'Unique ID of the role',
    example: '7ceb9ab7-6427-40b7-be2e-37ba6742d5fd',
  })
  @Expose({ name: 'id' })
  id: string;

  @ApiProperty({ description: 'Code of the role', example: 'admin' })
  @Expose({ name: 'code' })
  code: string;

  @ApiProperty({
    description: 'Users of the role',
    example: [
      '7ceb9ab7-6427-40b7-be2e-37ba6742d5fd',
      'b2512091-e319-4d8e-b475-90a6e8a55378',
    ],
  })
  @Expose({ name: 'users' })
  users: string[];

  @ApiProperty({
    description: 'Permissions of the role',
    example: ['add_constitution_version'],
  })
  @Expose({ name: 'permissions' })
  permissions: string[];

  @ApiProperty({
    name: 'created_at',
    type: Date,
    format: 'date-time',
    description: 'Time of creating a role',
  })
  @Expose({ name: 'createdAt' })
  createdAt: Timestamp;

  @ApiProperty({
    name: 'updated_at',
    type: Date,
    format: 'date-time',
    description: 'Time of updating a role',
  })
  @Expose({ name: 'updatedAt' })
  updatedAt: Timestamp;
}
