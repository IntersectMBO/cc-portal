import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  HttpCode,
  ParseUUIDPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  ParseFilePipeBuilder,
  UseGuards,
  Request,
  Delete,
  Query,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { UserPathGuard } from '../../auth/guard/users-path.guard';
import { SearchQueryDto, SortOrder } from '../dto/search-query.dto';
import { SortOrderPipe } from '../pipe/sort-order.pipe';
import { SearchPhrasePipe } from '../pipe/search-phrase.pipe';
import { RoleEnum } from '../enums/role.enum';
import { Roles } from '../../auth/guard/role.decorator';
import { RoleGuard } from '../../auth/guard/role.guard';
import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { Order } from '../../pagination/enums/order.enum';
import { PageOptionsDto } from '../../pagination/dto/page-options.dto';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersFacade: UsersFacade) {}

  @ApiOperation({ summary: 'Get all users and page metadata' })
  @ApiResponse({
    status: 200,
    description: 'Users in pages',
    isArray: true,
    type: PaginationDto<UserResponse>,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    // @Query() pageOptionsDto: PageOptionsDto,
    @Query('page') page: number = 1,
    @Query('take') take: number = 12,
    @Query('order') order: Order = Order.ASC,
  ): Promise<PaginationDto<UserResponse>> {
    const pageOptionsDto = new PageOptionsDto();
    pageOptionsDto.page = page;
    pageOptionsDto.take = take;
    pageOptionsDto.order = order;
    return await this.usersFacade.findAll(pageOptionsDto);
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

  // Search endpoint for CC Members
  // Returns all registered CC Members
  @ApiOperation({ summary: 'List of CC Members' })
  @ApiResponse({
    status: 200,
    description: 'Users',
    isArray: true,
    type: UserResponse,
  })
  @ApiQuery({
    name: 'sort_order',
    required: false,
    description:
      'Sort order parameter - can be either ASC (Ascending) or DESC (Descending)',
    enum: SortOrder,
  })
  @ApiQuery({
    name: 'phrase',
    required: false,
    description: 'A search phrase related to user name, does not accept * or ;',
    type: String,
  })
  @Get('cc-member/search')
  async searchCCMemeber(
    @Query('phrase', SearchPhrasePipe) searchPhrase: string,
    @Query('sort_order', SortOrderPipe) sortOrder: SortOrder,
  ) {
    if (!sortOrder) {
      sortOrder = SortOrder.DESC;
    }
    const searchQuery = new SearchQueryDto(searchPhrase, sortOrder);
    return await this.usersFacade.searchUsers(searchQuery, false);
  }

  // Search endpoint for admins and super admin
  // Returns all registered users except super admin
  @ApiOperation({ summary: 'List of Admins and CC Members' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Users',
    isArray: true,
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
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Identifactor of the user',
  })
  @ApiQuery({
    name: 'sort_order',
    required: false,
    description:
      'Sort order parameter - can be either ASC (Ascending) or DESC (Descending)',
    enum: SortOrder,
  })
  @ApiQuery({
    name: 'phrase',
    required: false,
    description: 'A search phrase related to user name, does not accept * or ;',
    type: String,
  })
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, UserPathGuard, RoleGuard)
  @Get(':id/search-admin')
  async searchAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('phrase', SearchPhrasePipe) searchPhrase: string,
    @Query('sort_order', SortOrderPipe) sortOrder: SortOrder,
  ): Promise<UserResponse[]> {
    if (!sortOrder) {
      sortOrder = SortOrder.DESC;
    }
    const searchQuery = new SearchQueryDto(searchPhrase, sortOrder);
    return await this.usersFacade.searchUsers(searchQuery, true);
  }

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
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 3145728,
        })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponse> {
    return await this.usersFacade.updateProfilePhoto(file, id);
  }

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
}
