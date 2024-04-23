import { Injectable } from '@nestjs/common';
import { UpdateUserRequest } from '../api/request/update-user.request';
import { UsersService } from '../services/users.service';
import { UserResponse } from '../api/response/user.response';
import { UserMapper } from '../mapper/userMapper.mapper';
import { RoleResponse } from '../api/response/role.response';
import { RoleMapper } from '../mapper/roleMapper.mapper';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';
import { PageOptionsDto } from 'src/pagination/dto/page-options.dto';
import { PageMetaDto } from 'src/pagination/dto/page-meta.dto';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UsersFacade {
  constructor(private readonly usersService: UsersService) {}

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PaginationDto<UserResponse>> {
    const userCountDto = await this.usersService.findAll(pageOptionsDto);

    const userDto = userCountDto.userDto;
    const itemCount = userCountDto.itemCount;

    const userResponse = userDto.map((userDto: UserDto) =>
      UserMapper.mapUserDtoToResponse(userDto),
    );

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PaginationDto(userResponse, pageMetaDto);
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
