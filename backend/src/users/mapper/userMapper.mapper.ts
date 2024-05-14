import { plainToClass } from 'class-transformer';
import { User } from '../entities/user.entity';
import { CreateUserRequest } from '../api/request/create-user.request';
import { CreateCCMemberRequest } from '../api/request/create-cc-member.request';
import { CreateAdminRequest } from '../api/request/create-admin.request';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { UpdateUserRequest } from '../api/request/update-user.request';
import { UserResponse } from '../api/response/user.response';

export class UserMapper {
  static userToDto(user: User): UserDto {
    const userDto = plainToClass(UserDto, user);
    userDto.role = user.role?.code;
    userDto.permissions =
      user.permissions?.map((permission) => permission.code) || [];
    userDto.hotAddresses =
      user.hotAddresses?.map((hotAddress) => hotAddress.address) || [];
    return userDto;
  }

  static mapCreateUserRequestToDto(
    createUserRequest: CreateUserRequest,
  ): CreateUserDto {
    return plainToClass(CreateUserDto, createUserRequest);
  }

  static mapCreateCCMemberRequestToCreateUserRequest(
    createCCMemberRequest: CreateCCMemberRequest,
  ): CreateUserRequest {
    return plainToClass(CreateUserRequest, createCCMemberRequest);
  }

  static mapCreateAdminRequestToCreateUserRequest(
    createAdminRequest: CreateAdminRequest,
  ): CreateUserRequest {
    return plainToClass(CreateUserRequest, createAdminRequest);
  }

  static mapUpdateUserRequestToDto(
    updateUserRequest: UpdateUserRequest,
  ): UpdateUserDto {
    return plainToClass(UpdateUserDto, updateUserRequest);
  }

  static mapUserDtoToResponse(userDto: UserDto): UserResponse {
    return plainToClass(UserResponse, userDto);
  }
}
