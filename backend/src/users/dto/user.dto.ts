import { Timestamp } from 'typeorm';
import { UserStatusEnum } from '../enums/user-status.enum';

export class UserDto {
  id: string;
  name: string;
  email: string;
  description: string;
  profilePhotoUrl: string;
  status: UserStatusEnum;
  hotAddresses: string[];
  role: string;
  permissions: string[];
  deactivatedAt: Date;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
