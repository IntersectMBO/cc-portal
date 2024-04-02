import { Timestamp } from 'typeorm';

export class UserDto {
  id: string;
  name: string;
  email: string;
  hotAddress: string;
  description: string;
  profilePhoto: string;
  status: string;
  roles: string[];
  permissions: string[];
  whitelisted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
