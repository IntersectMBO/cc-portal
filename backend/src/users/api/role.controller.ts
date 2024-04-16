import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  HttpCode,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  ParseFilePipeBuilder,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { UsersFacade } from '../facade/users.facade';
import { UpdateUserRequest } from './request/update-user.request';
import { UserResponse } from './response/user.response';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleResponse } from './response/role.response';

import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UserPathGuard } from 'src/auth/guard/users-path.guard';
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
  @ApiResponse({ status: 404, description: 'Role not found' })
  @Get()
  async getAllRoles(): Promise<RoleResponse[]> {
    return await this.usersFacade.getAllRoles();
  }
}
