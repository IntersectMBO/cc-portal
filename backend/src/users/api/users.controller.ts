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
  UseGuards,
  Request,
  Delete,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
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
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { UserPathGuard } from '../../auth/guard/users-path.guard';
import { RoleEnum } from '../enums/role.enum';
import { Roles } from '../../auth/guard/role.decorator';
import { RoleGuard } from '../../auth/guard/role.guard';
import { PaginatedResponse } from '../../util/pagination/response/paginated.response';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from '../util/pagination/user-pagination.config';
import { PermissionEnum } from '../enums/permission.enum';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { ToggleStatusRequest } from './request/toggle-status.request';
import { ApiConditionalExcludeEndpoint } from 'src/common/decorators/api-conditional-exclude-endpoint.decorator';
import { Permissions } from 'src/auth/guard/permission.decorator';
import { RemoveUserRequest } from './request/remove-user.request';
import { UpdateRoleAndPermissionsRequest } from './request/update-role-and-permissions.request';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersFacade: UsersFacade) {}

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

  @ApiConditionalExcludeEndpoint()
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
    status: 401,
    description: 'Unauthorized',
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
  @HttpCode(200)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, UserPathGuard)
  async update(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserRequest: UpdateUserRequest,
  ): Promise<UserResponse> {
    return await this.usersFacade.update(id, updateUserRequest);
  }

  /**
   Search endpoint for CC Members
   Returns all registered CC Members
   **/
  @ApiOperation({ summary: 'Search users' })
  @ApiPaginationQuery(USER_PAGINATION_CONFIG)
  @ApiResponse({
    status: 200,
    description: 'Users - returns UserResponse array within data',
    isArray: true,
    type: PaginatedResponse<UserResponse>,
  })
  @Get('cc-member/search')
  async searchMembersPaginated(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<UserResponse>> {
    return await this.usersFacade.searchUsers(query, false);
  }

  /**
   Search endpoint for admins and super admin
   Returns all registered users except super admin
   **/
  @ApiConditionalExcludeEndpoint()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Search users as admin' })
  @ApiPaginationQuery(USER_PAGINATION_CONFIG)
  @ApiResponse({
    status: 200,
    description: 'Users - returns UserResponse array within data',
    isArray: true,
    type: PaginatedResponse<UserResponse>,
  })
  @Get(':id/search-admin')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, UserPathGuard, RoleGuard)
  async searchAdminPaginated(
    @Param('id', ParseUUIDPipe) id: string,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<UserResponse>> {
    return await this.usersFacade.searchUsers(query, true);
  }

  @ApiConditionalExcludeEndpoint()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a users photo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'file' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Users photo updated successfully.',
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
  @ApiResponse({
    status: 422,
    description: 'File is required',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'identification number of the user',
    type: String,
  })
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id/profile-photo')
  @UseGuards(JwtAuthGuard, UserPathGuard)
  async updateProfilePhoto(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponse> {
    return await this.usersFacade.updateProfilePhoto(file, id);
  }

  @ApiConditionalExcludeEndpoint()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete photo of user' })
  @ApiResponse({ status: 200, description: 'Photo successfully removed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'User does not have profile photo' })
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

  @ApiConditionalExcludeEndpoint()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Activate / Deactivate User Status' })
  @ApiResponse({
    status: 200,
    description: 'User status changed successfully.',
    type: UserResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  @ApiResponse({
    status: 404,
    description: 'User with {id} not found',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Identification number of the user',
    type: String,
  })
  @ApiBody({ type: ToggleStatusRequest })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, UserPathGuard, PermissionGuard)
  @Patch(':id/toggle-status')
  async toggleStatus(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() toggleStatusRequest: ToggleStatusRequest,
  ): Promise<UserResponse> {
    const permissions: PermissionEnum[] = req.user.permissions;
    return await this.usersFacade.toggleStatus(
      toggleStatusRequest,
      permissions,
    );
  }

  @ApiConditionalExcludeEndpoint()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'identifactor of user',
  })
  @ApiBody({ type: RemoveUserRequest })
  @HttpCode(200)
  @Permissions(PermissionEnum.MANAGE_ADMINS) // Superadmin only
  @UseGuards(JwtAuthGuard, UserPathGuard, PermissionGuard)
  @Delete(':id')
  async removeUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() removeUserRequest: RemoveUserRequest,
  ) {
    if (id === removeUserRequest.userId) {
      throw new BadRequestException(`You cannot delete yourself`);
    }
    await this.usersFacade.removeUser(removeUserRequest.userId);
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  @ApiConditionalExcludeEndpoint()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update user role and permissions by superadmin',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Identification number of the user',
    type: String,
  })
  @ApiBody({ type: UpdateRoleAndPermissionsRequest })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @HttpCode(200)
  @Patch(':id/role-permissions')
  @Permissions(PermissionEnum.MANAGE_ROLES_AND_PERMISSIONS)
  @UseGuards(JwtAuthGuard, UserPathGuard, PermissionGuard)
  async updateUserRoleAndPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleAndPermissionsRequest: UpdateRoleAndPermissionsRequest,
  ): Promise<UserResponse> {
    return await this.usersFacade.updateUserRoleAndPermissions(
      updateRoleAndPermissionsRequest,
    );
  }
}
