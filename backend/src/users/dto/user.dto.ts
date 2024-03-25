import { Timestamp } from 'typeorm';
import { UserStatusEnum } from '../entities/user.entity';

export class UserDto {
  id: string;
  name: string;
  email: string;
  hotAddress: string;
  description: string;
  profilePhoto: string;
  status: UserStatusEnum;
  roles: string[];
  permissions: string[];
  whitelisted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
