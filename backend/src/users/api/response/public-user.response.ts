import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Timestamp } from 'typeorm';

/**
 * Public profile of a CC member, returned by endpoints that do not require
 * authentication. Contact details, addresses, roles, permissions and account
 * status are intentionally not part of this response.
 */
export class PublicUserResponse {
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
    name: 'created_at',
    type: Date,
    format: 'date-time',
    description: 'Time of creating a user',
  })
  @Expose({ name: 'created_at' })
  createdAt: Timestamp;
}
