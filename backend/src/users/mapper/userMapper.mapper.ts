import { CreateAdminRequest } from '../api/request/create-admin.request';
import { CreateCCMemberRequest } from '../api/request/create-cc-member.request';
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
    userDto.description = user.description;
    userDto.profilePhotoUrl = user.profilePhotoUrl;
    userDto.status = user.status;
    userDto.hotAddresses = user.hotAddresses?.map(
      (hotAddress) => hotAddress.address,
    );
    userDto.role = user.role.code;
    userDto.permissions = user.permissions?.map(
      (permission) => permission.code,
    );
    userDto.deactivatedAt = user.deactivatedAt;
    userDto.createdAt = user.createdAt;
    userDto.updatedAt = user.updatedAt;

    return userDto;
  }

  static mapCreateUserRequestToDto(
    createUserRequest: CreateUserRequest,
  ): CreateUserDto {
    const createUserDto = new CreateUserDto();
    createUserDto.destination = createUserRequest.destination;
    createUserDto.permissions = createUserRequest.permissions;
    return createUserDto;
  }

  static mapCreateCCMemberRequestToCreateUserRequest(
    createCCMemberRequest: CreateCCMemberRequest,
  ): CreateUserRequest {
    const createUserRequest = new CreateUserRequest();
    createUserRequest.destination = createCCMemberRequest.destination;
    return createUserRequest;
  }

  static mapCreateAdminRequestToCreateUserRequest(
    createAdminRequest: CreateAdminRequest,
  ): CreateUserRequest {
    const createUserRequest = new CreateUserRequest();
    createUserRequest.destination = createAdminRequest.destination;
    createUserRequest.permissions = createAdminRequest.permissions;
    return createUserRequest;
  }

  static mapUpdateUserRequestToDto(
    updateUserRequest: UpdateUserRequest,
  ): UpdateUserDto {
    const updateUserDto = new UpdateUserDto();
    updateUserDto.name = updateUserRequest.name;
    updateUserDto.description = updateUserRequest.description;
    updateUserDto.hotAddress = updateUserRequest.hotAddress;
    return updateUserDto;
  }

  static mapUserDtoToResponse(userDto: UserDto): UserResponse {
    const userResponse = new UserResponse();
    userResponse.id = userDto.id;
    userResponse.name = userDto.name;
    userResponse.email = userDto.email;
    userResponse.hotAddresses = userDto.hotAddresses;
    userResponse.description = userDto.description;
    userResponse.profilePhotoUrl = userDto.profilePhotoUrl;
    userResponse.status = userDto.status;
    userResponse.role = userDto.role;
    userResponse.permissions = userDto.permissions;
    userResponse.deactivatedAt = userDto.deactivatedAt;
    userResponse.createdAt = userDto.createdAt;
    userResponse.updatedAt = userDto.updatedAt;
    return userResponse;
  }
}
