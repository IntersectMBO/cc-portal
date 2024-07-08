import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserStatusEnum } from '../../enums/user-status.enum';
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

  @ApiProperty({
    description: 'Hot addresses of the user',
    example: ['sofija@example.com', 'newyork@example.com'],
    type: [String],
  })
  @Expose({ name: 'hot_addresses' })
  hotAddresses: string[];

  @ApiProperty({
    description: 'Description of the user',
    example:
      'Travel enthusiast and adventure seeker always looking for new destinations to explore.',
  })
  @Expose({ name: 'description' })
  description: string;

  @ApiProperty({
    description: 'Profile photo of the user',
    example: 'path/to/image.jpg',
  })
  @Expose({ name: 'profile_photo_url' })
  profilePhotoUrl: string;

  @ApiProperty({
    description: 'Status of user',
    example: 'pending',
  })
  @Expose({ name: 'status' })
  status: UserStatusEnum;

  @ApiProperty({ description: 'Role of the user', example: 'user' })
  @Expose({ name: 'role' })
  role: string;

  @ApiProperty({
    description: 'Permissions of the user',
    example: ['manage_cc_members'],
  })
  @Expose({ name: 'permissions' })
  permissions: string[];

  @ApiProperty({
    description: 'A flag indicating whether the user is deleted or not',
    example: false,
  })
  @Expose({ name: 'id_deleted' })
  isDeleted: boolean;

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
