import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateUserRequest } from '../api/request/update-user.request';
import { UsersService } from '../services/users.service';
import { UserResponse } from '../api/response/user.response';
import { UserMapper } from '../mapper/userMapper.mapper';
import { RoleResponse } from '../api/response/role.response';
import { RoleMapper } from '../mapper/roleMapper.mapper';
import { S3Service } from 'src/s3/service/s3.service';
import { UploadContext } from 'src/s3/enums/upload-context';
@Injectable()
export class UsersFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
  ) {}

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

  async update(
    file: Express.Multer.File,
    id: string,
    updateUserRequest: UpdateUserRequest,
  ) {
    const updateUserDto =
      UserMapper.mapUpdateUserRequestToDto(updateUserRequest);

    const fileUrl = await this.storeProfilePhotoIfExists(file, id);
    const user = await this.usersService.update(fileUrl, id, updateUserDto);
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
    if (!userDto.profilePhoto) {
      throw new ConflictException(`user does not have profile photo`);
    }

    const user = await this.usersService.removeProfilePhoto(userId);

    const fileName = S3Service.extractFileNameFromUrl(userDto.profilePhoto);
    await this.s3Service.deleteFile(UploadContext.PROFILE_PHOTO, fileName);

    return UserMapper.mapUserDtoToResponse(user);
  }
}
