import { Timestamp } from "typeorm";

export class UserDto {
  id: string;
  name: string;
  email: string;
  hotAddress: string;
  description: string;
  profilePhoto: string;
  roles: string[];
  whitelisted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
