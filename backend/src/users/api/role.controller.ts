import { Controller, Get } from '@nestjs/common';
import { UsersFacade } from '../facade/users.facade';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleResponse } from './response/role.response';
@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly usersFacade: UsersFacade) {}

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Roles',
    isArray: true,
    type: RoleResponse,
  })
  @Get()
  async getAllRoles(): Promise<RoleResponse[]> {
    return await this.usersFacade.getAllRoles();
  }
}
