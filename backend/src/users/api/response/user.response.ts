import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Timestamp } from 'typeorm';

export class UserResponse {
  @ApiProperty({
    description: 'Unique ID of the user',
    example: '7ceb9ab7-6427-40b7-be2e-37ba6742d5fd',
  })
  @Expose({ name: 'id' })
  id: string;

  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  @Expose({ name: 'name' })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @Expose({ name: 'email' })
  email: string;

  @ApiProperty({ description: 'Roles of the user', example: ['user'] })
  @Expose({ name: 'roles' })
  roles: string[];

  @ApiProperty({
    description: 'Flag that deterines whether user is blacklisted or not',
    example: false,
  })
  @Expose({ name: 'whitelisted' })
  whitelisted: boolean;

  @ApiProperty({
    name: 'created_at',
    type: Date,
    format: 'date-time',
    description: 'Time of creating a user',
  })
  @Expose({ name: 'created_at' })
  createdAt: Timestamp;

  @ApiProperty({
    name: 'updated_at',
    type: Date,
    format: 'date-time',
    description: 'Time of updating a user',
  })
  @Expose({ name: 'updated_at' })
  updatedAt: Timestamp;
}
