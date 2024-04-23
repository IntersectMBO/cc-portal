import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  HttpCode,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersFacade } from '../facade/users.facade';
import { UpdateUserRequest } from './request/update-user.request';
import { UserResponse } from './response/user.response';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleResponse } from './response/role.response';
import { PageOptionsDto } from '../../pagination/dto/page-options.dto';
import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { Order } from 'src/pagination/enums/order.enum';

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
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserRequest: UpdateUserRequest,
  ): Promise<UserResponse> {
    return await this.usersFacade.update(id, updateUserRequest);
  }
}
