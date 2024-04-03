import { RoleResponse } from '../api/response/role.response';
import { RoleDto } from '../dto/role.dto';
import { Role } from '../entities/role.entity';

export class RoleMapper {
  static roleToDto(role: Role): RoleDto {
    const roleDto = new RoleDto();
    roleDto.id = role.id;
    roleDto.code = role.code;
    roleDto.users = role.users?.map((user) => user.id);
    roleDto.permissions = role.permissions?.map(
      (permission) => permission.code,
    );
    roleDto.createdAt = role.createdAt;
    roleDto.updatedAt = role.updatedAt;
    return roleDto;
  }

  static mapRoleDtoToResponse(roleDto: RoleDto): RoleResponse {
    const roleResponse = new RoleResponse();
    roleResponse.id = roleDto.id;
    roleResponse.code = roleDto.code;
    roleResponse.users = roleDto.users;
    roleResponse.permissions = roleDto.permissions;
    roleResponse.createdAt = roleDto.createdAt;
    roleResponse.updatedAt = roleDto.updatedAt;
    return roleResponse;
  }
}
