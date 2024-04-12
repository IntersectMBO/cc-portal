import { Timestamp } from 'typeorm';
import { UserStatusEnum } from '../entities/user.entity';

export class UserDto {
  id: string;
  name: string;
  email: string;
  description: string;
  profilePhoto: string;
  status: UserStatusEnum;
  hotAddresses: string[];
  role: string;
  permissions: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
