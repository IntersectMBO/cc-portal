import { Timestamp } from 'typeorm';

export class UserDto {
  id: string;
  name: string;
  email: string;
  roles: string[];
  whitelisted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
