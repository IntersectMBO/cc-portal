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

import { FileInterceptor } from '@nestjs/platform-express';
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
  @ApiBody({ type: UpdateUserRequest })
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
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserRequest: UpdateUserRequest,
  ): Promise<UserResponse> {
    return await this.usersFacade.update(file, id, updateUserRequest);
  }
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete photo of user' })
  @ApiResponse({ status: 200, description: 'Photo successfully removed' })
  @ApiResponse({ status: 404, description: 'User with id not found' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'identifactor of user',
  })
  @Delete(':id/profile-photo')
  @UseGuards(JwtAuthGuard, UserPathGuard)
  async remove(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersFacade.deleteProfilePhoto(id);
    return user;
  }
}
