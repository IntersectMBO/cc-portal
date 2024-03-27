import { CreateUserRequest } from '../api/request/create-user.request';
import { UpdateUserRequest } from '../api/request/update-user.request';
import { UserResponse } from '../api/response/user.response';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';

export class UserMapper {
  static userToDto(user: User): UserDto {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.name = user.name;
    userDto.email = user.email;
    userDto.hotAddress = user.hotAddress;
    userDto.description = user.description;
    userDto.profilePhoto = user.profilePhoto;
    userDto.status = user.status;
    userDto.whitelisted = user.whitelisted;
    userDto.roles = user.roles?.map((role) => role.code);
    userDto.permissions = user.permissions?.map(
      (permission) => permission.code,
    );

    userDto.createdAt = user.createdAt;
    userDto.updatedAt = user.updatedAt;

    return userDto;
  }

  static mapCreateUserRequestToDto(
    createUserRequest: CreateUserRequest,
  ): CreateUserDto {
    const createUserDto = new CreateUserDto();
    createUserDto.destination = createUserRequest.destination;
    createUserDto.roles = createUserRequest.roles;
    createUserDto.permissions = createUserRequest.permissions;
    return createUserDto;
  }

  static mapUpdateUserRequestToDto(
    updateUserRequest: UpdateUserRequest,
  ): UpdateUserDto {
    const updateUserDto = new UpdateUserDto();
    updateUserDto.name = updateUserRequest.name;
    return updateUserDto;
  }

  static mapUserDtoToResponse(userDto: UserDto): UserResponse {
    const userResponse = new UserResponse();
    userResponse.id = userDto.id;
    userResponse.name = userDto.name;
    userResponse.email = userDto.email;
    userResponse.hotAddress = userDto.hotAddress;
    userResponse.description = userDto.description;
    userResponse.profilePhoto = userDto.profilePhoto;
    userResponse.status = userDto.status;
    userResponse.whitelisted = userDto.whitelisted;
    userResponse.roles = userDto.roles;
    userResponse.permissions = userDto.permissions;
    userResponse.createdAt = userDto.createdAt;
    userResponse.updatedAt = userDto.updatedAt;
    return userResponse;
  }
}
