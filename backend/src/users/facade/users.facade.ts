import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateUserRequest } from '../api/request/update-user.request';
import { UsersService } from '../services/users.service';
import { UserResponse } from '../api/response/user.response';
import { UserMapper } from '../mapper/userMapper.mapper';
import { RoleResponse } from '../api/response/role.response';
import { RoleMapper } from '../mapper/roleMapper.mapper';
import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { PageOptionsDto } from '../../pagination/dto/page-options.dto';
import { PageMetaResponse } from '../../pagination/response/page-meta.response';
import { UserDto } from '../dto/user.dto';

import { S3Service } from '../../s3/service/s3.service';
import { UploadContext } from '../../s3/enums/upload-context';
import { SearchQueryDto } from '../dto/search-query.dto';
@Injectable()
export class UsersFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
  ) {}

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PaginationDto<UserResponse>> {
    const userCountDto = await this.usersService.findAll(pageOptionsDto);

    const userDto = userCountDto.userDto;
    const itemCount = userCountDto.itemCount;

    const userResponse: UserResponse[] = userDto.map((userDto: UserDto) =>
      UserMapper.mapUserDtoToResponse(userDto),
    );

    const pageMetaResponse = new PageMetaResponse({
      itemCount,
      pageOptionsDto,
    });
    return new PaginationDto(userResponse, pageMetaResponse);
  }

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
    searchQuery: SearchQueryDto,
    isAdmin: boolean,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PaginationDto<UserResponse>> {
    const userCountDto = await this.usersService.searchUsers(
      searchQuery,
      isAdmin,
      pageOptionsDto,
    );

    const userDto = userCountDto.userDto;
    const itemCount = userCountDto.itemCount;

    const userResponse: UserResponse[] = userDto.map((userDto: UserDto) =>
      UserMapper.mapUserDtoToResponse(userDto),
    );
    const pageMetaDto = new PageMetaResponse({ itemCount, pageOptionsDto });

    return new PaginationDto(userResponse, pageMetaDto);
  }
}
