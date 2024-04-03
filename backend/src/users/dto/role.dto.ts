import { Timestamp } from 'typeorm';

export class RoleDto {
  id: string;
  code: string;
  users: string[];
  permissions: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
