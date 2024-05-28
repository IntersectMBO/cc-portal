import { UserDto } from './user.dto';

export class UsersPaginatedDto {
  userDtos: UserDto[];
  itemCount: number;
}
