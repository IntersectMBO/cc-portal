import { Injectable } from "@nestjs/common";
import { UpdateUserRequest } from "../api/request/update-user.request";
import { UsersService } from "../services/users.service";
import { CreateUserRequest } from "../api/request/create-user.request";
import { UserResponse } from "../api/response/user.response";
import { UserMapper } from "../mapper/userMapper.mapper";
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

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.usersService.findOne(id);
    return UserMapper.mapUserDtoToResponse(user);
  }

  async create(createUserRequest: CreateUserRequest): Promise<UserResponse> {
    const createUserDto =
      UserMapper.mapCreateUserRequestToDto(createUserRequest);
    const user = await this.usersService.create(createUserDto);
    return UserMapper.mapUserDtoToResponse(user);
  }

  async update(id: string, updateUserRequest: UpdateUserRequest) {
    const updateUserDto =
      UserMapper.mapUpdateUserRequestToDto(updateUserRequest);
    return this.usersService.update(id, updateUserDto);
  }

  async toggleWhitelist(
    id: string,
    whitelisted: boolean,
  ): Promise<UserResponse> {
    const userDto = await this.usersService.toggleWhitelist(id, whitelisted);
    return UserMapper.mapUserDtoToResponse(userDto);
  }
}
