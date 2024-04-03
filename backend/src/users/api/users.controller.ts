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
} from '@nestjs/common';
import { UsersFacade } from '../facade/users.facade';
import { UpdateUserRequest } from './request/update-user.request';
import { UserResponse } from './response/user.response';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleResponse } from './response/role.response';

import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersFacade: UsersFacade) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users',
    isArray: true,
    type: UserResponse,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get()
  async findAll(): Promise<UserResponse[]> {
    return await this.usersFacade.findAll();
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Roles',
    isArray: true,
    type: RoleResponse,
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @Get('roles')
  async getAllRoles(): Promise<RoleResponse[]> {
    return await this.usersFacade.getAllRoles();
  }

  @ApiOperation({ summary: 'Find one user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user details',
    type: UserResponse,
  })
  @ApiResponse({ status: 404, description: 'User with {id} not found' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponse> {
    return await this.usersFacade.findOne(id);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiBody({ type: UpdateUserRequest })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: UserResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'user with {id} not found',
  })
  @ApiResponse({
    status: 409,
    description: 'User with requested email address already exists',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  async update(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 3145728,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserRequest: UpdateUserRequest,
  ): Promise<UserResponse> {
    return await this.usersFacade.update(file, id, updateUserRequest);
  }
}
