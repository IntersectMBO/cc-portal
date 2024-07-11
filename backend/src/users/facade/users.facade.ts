import {
  ConflictException,
  ForbiddenException,
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
import { UserStatusEnum } from '../enums/user-status.enum';
import { PermissionEnum } from '../enums/permission.enum';
import { RoleEnum } from '../enums/role.enum';
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
    userId: string,
    status: UserStatusEnum,
    permissions: PermissionEnum[],
  ): Promise<UserResponse> {
    const user = await this.usersService.findById(userId);
    this.checkAbilityToggleStatus(user, permissions);
    const result = await this.usersService.updateUserStatus(user.id, status);
    return UserMapper.mapUserDtoToResponse(result);
  }

  /**
   * Checks whether the logged-in user can change status
   * @param user - User whose status we change
   * @param permissions - Permissions of the logged-in user
   */
  private checkAbilityToggleStatus(
    user: UserDto,
    permissions: PermissionEnum[],
  ): void {
    if (
      user.role === RoleEnum.SUPER_ADMIN ||
      (user.role === RoleEnum.ADMIN &&
        !permissions.includes(PermissionEnum.MANAGE_ADMINS))
    ) {
      throw new ForbiddenException(`You have no permission for this action`);
    }
  }
}
