import { RoleResponse } from '../api/response/role.response';
import { RoleDto } from '../dto/role.dto';
import { Role } from '../entities/role.entity';
import { plainToClass } from 'class-transformer';

export class RoleMapper {
  static roleToDto(role: Role): RoleDto {
    const roleDto = plainToClass(RoleDto, role);
    roleDto.users = role.users?.map((user) => user.id);
    roleDto.permissions = role.permissions?.map(
      (permission) => permission.code,
    );
    return roleDto;
  }

  static mapRoleDtoToResponse(roleDto: RoleDto): RoleResponse {
    return plainToClass(RoleResponse, roleDto);
  }
}
