import { Injectable } from '@nestjs/common';
import { UpdateUserRequest } from '../api/request/update-user.request';
import { UsersService } from '../services/users.service';
import { UserResponse } from '../api/response/user.response';
import { UserMapper } from '../mapper/userMapper.mapper';
import { RoleResponse } from '../api/response/role.response';
import { RoleMapper } from '../mapper/roleMapper.mapper';
@Injectable()
export class UsersFacade {
  constructor(private readonly usersService: UsersService) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.usersService.findAll();
    const results: UserResponse[] = users.map((x) =>
      UserMapper.mapUserDtoToResponse(x),
    );
    return results;
  }

  async getAllRoles(): Promise<RoleResponse[]> {
    const roles = await this.usersService.getAllRoles();
    const results: RoleResponse[] = roles.map((role) =>
      RoleMapper.mapRoleDtoToResponse(role),
    );
    return results;
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.usersService.findOne(id);
    return UserMapper.mapUserDtoToResponse(user);
  }

  async update(id: string, updateUserRequest: UpdateUserRequest) {
    const updateUserDto =
      UserMapper.mapUpdateUserRequestToDto(updateUserRequest);
    const user = await this.usersService.update(id, updateUserDto);
    return UserMapper.mapUserDtoToResponse(user);
  }
}
