import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UpdateUserRequest } from '../api/request/update-user.request';
import { UsersService } from '../services/users.service';
import { UserResponse } from '../api/response/user.response';
import { UserMapper } from '../mapper/userMapper.mapper';
import { RoleResponse } from '../api/response/role.response';
import { RoleMapper } from '../mapper/roleMapper.mapper';
import { PaginatedResponse } from '../../util/pagination/response/paginated.response';
import { UserDto } from '../dto/user.dto';

import { S3Service } from '../../s3/service/s3.service';
import { UploadContext } from '../../s3/enums/upload-context';
import { PaginateQuery } from 'nestjs-paginate';
import { PaginationDtoMapper } from 'src/util/pagination/mapper/pagination.mapper';
import { PermissionEnum } from '../enums/permission.enum';
import { ToggleStatusRequest } from '../api/request/toggle-status.request';
import { UserStatusEnum } from '../enums/user-status.enum';
@Injectable()
export class UsersFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
  ) {}

  async getAllRoles(): Promise<RoleResponse[]> {
    const roles = await this.usersService.getAllRoles();
    const results: RoleResponse[] = roles.map((role) =>
      RoleMapper.mapRoleDtoToResponse(role),
    );
    return results;
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.usersService.findById(id);
    return UserMapper.mapUserDtoToResponse(user);
  }

  async update(id: string, updateUserRequest: UpdateUserRequest) {
    const updateUserDto =
      UserMapper.mapUpdateUserRequestToDto(updateUserRequest);
    const user = await this.usersService.update(id, updateUserDto);
    return UserMapper.mapUserDtoToResponse(user);
  }

  async updateProfilePhoto(file: Express.Multer.File, id: string) {
    const fileUrl = await this.storeProfilePhotoIfExists(file, id);
    const user = await this.usersService.updateProfilePhoto(fileUrl, id);
    return UserMapper.mapUserDtoToResponse(user);
  }
  private async storeProfilePhotoIfExists(
    file: Express.Multer.File,
    id: string,
  ): Promise<string> {
    if (file) {
      const fileUrl = await this.s3Service.uploadFile(
        UploadContext.PROFILE_PHOTO,
        id,
        file,
      );
      return fileUrl;
    }
    return null;
  }
  async deleteProfilePhoto(userId: string): Promise<UserResponse> {
    const userDto = await this.usersService.findById(userId);
    if (!userDto.profilePhotoUrl) {
      throw new ConflictException(`user does not have profile photo`);
    }

    const user = await this.usersService.removeProfilePhoto(userId);

    const fileName = S3Service.extractFileNameFromUrl(userDto.profilePhotoUrl);
    await this.s3Service.deleteFile(fileName);

    return UserMapper.mapUserDtoToResponse(user);
  }

  async searchUsers(
    query: PaginateQuery,
    isAdmin: boolean,
  ): Promise<PaginatedResponse<UserResponse>> {
    const usersPaginatedDto = await this.usersService.searchUsers(
      query,
      isAdmin,
    );

    return new PaginationDtoMapper<UserDto, UserResponse>().dtoToResponse(
      usersPaginatedDto,
      UserMapper.mapUserDtoToResponse,
    );
  }

  async toggleStatus(
    toggleStatusRequest: ToggleStatusRequest,
    permissions: PermissionEnum[],
  ): Promise<UserResponse> {
    const user = await this.usersService.findById(toggleStatusRequest.userId);
    // Current status of the user 'pending' cannot be changed in this way
    if (user.status === UserStatusEnum.PENDING) {
      throw new BadRequestException(
        `Unable to change current status ${UserStatusEnum.PENDING}`,
      );
    }
    this.usersService.checkRoleManagedByPermission(user.role, permissions);
    const result = await this.usersService.updateUserStatus(
      user.id,
      toggleStatusRequest.status,
    );
    return UserMapper.mapUserDtoToResponse(result);
  }
}
