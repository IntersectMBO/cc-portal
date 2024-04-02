import {
  Controller,
  Get,
  Post,
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
} from '@nestjs/common';
import { UsersFacade } from '../facade/users.facade';
import { CreateUserRequest } from './request/create-user.request';
import { UpdateUserRequest } from './request/update-user.request';
import { UserResponse } from './response/user.response';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ToggleWhitelistedRequest } from './request/toggle-whitelisted.request';
import { Roles } from 'src/auth/guard/role.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { RoleEnum } from '../entities/role.entity';

import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersFacade: UsersFacade) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreateUserRequest })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 409,
    description: 'User with requested email address already exists',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @HttpCode(201)
  @Post()
  async create(
    @Body() createUserRequest: CreateUserRequest,
  ): Promise<UserResponse> {
    return await this.usersFacade.create(createUserRequest);
  }

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

  @ApiOperation({ summary: 'Toggle blacklist of the user profile' })
  @ApiParam({
    name: 'email',
    description: `User's email address`,
    type: String,
  })
  @ApiBody({ type: ToggleWhitelistedRequest })
  @ApiResponse({
    status: 200,
    description: 'Whitelist has been updated',
    type: UserResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({ status: 404, description: 'User with {id} not found' })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id/whitelist')
  async toggleWhitelist(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() toggleWhitelistedRequest: ToggleWhitelistedRequest,
  ): Promise<UserResponse> {
    return await this.usersFacade.toggleWhitelist(
      id,
      toggleWhitelistedRequest.whitelisted,
    );
  }
}
