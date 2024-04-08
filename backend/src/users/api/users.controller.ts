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
  BadRequestException,
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
import { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UserPathGuard } from 'src/auth/guard/users-path.guard';
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

  @ApiBearerAuth('JWT-auth')
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
    status: 400,
    description: 'provided id does not match the requested one',
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
  @ApiParam({
    name: 'id',
    required: true,
    description: 'identification number of the user',
    type: String,
  })
  @ApiBody({
    type: UpdateUserRequest,
    description: 'Data to update the user with',
  })
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  @UseGuards(JwtAuthGuard, UserPathGuard)
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
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserRequest: UpdateUserRequest,
  ): Promise<UserResponse> {
    const userPayload = req.user;
    if (userPayload.userId !== id) {
      throw new BadRequestException(
        `provided id does not match the requested one`,
      );
    }
    return await this.usersFacade.update(file, id, updateUserRequest);
  }
}
