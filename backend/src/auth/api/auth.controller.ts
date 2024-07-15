import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MagicLoginStrategy } from '../strategy/magiclogin.strategy';
import { LoginRequest } from './request/login.request';
import { AuthFacade } from '../facade/auth.facade';
import { AuthGuard } from '@nestjs/passport';
import { TokenResponse } from './response/token.response';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RefreshTokenRequest } from './request/refresh-token.request';
import { MagicRegisterStrategy } from '../strategy/magicregister.strategy';
import { PermissionGuard } from '../guard/permission.guard';
import { Permissions } from '../guard/permission.decorator';
import { PermissionEnum } from 'src/users/enums/permission.enum';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { RoleEnum } from 'src/users/enums/role.enum';
import { CreateCCMemberRequest } from 'src/users/api/request/create-cc-member.request';
import { UserMapper } from 'src/users/mapper/userMapper.mapper';
import { CreateAdminRequest } from 'src/users/api/request/create-admin.request';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authFacade: AuthFacade,
    private readonly loginStrategy: MagicLoginStrategy,
    private readonly registerStrategy: MagicRegisterStrategy,
  ) {}

  @ApiOperation({ summary: 'Register a user. Sending email with a magic link' })
  @ApiBody({ type: CreateCCMemberRequest })
  @ApiResponse({
    status: 201,
    description: `{ "success": "true" }`,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @HttpCode(201)
  @Post('register-user')
  @Permissions(PermissionEnum.MANAGE_CC_MEMBERS)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  async registerUser(
    @Req() req,
    @Res() res,
    @Body() createCCMemberRequest: CreateCCMemberRequest,
  ) {
    const createUserRequest =
      UserMapper.mapCreateCCMemberRequestToCreateUserRequest(
        createCCMemberRequest,
      );
    await this.authFacade.register(createUserRequest, RoleEnum.USER);
    return this.registerStrategy.send(req, res);
  }

  @ApiOperation({
    summary: 'Register an admin. Sending email with a magic link',
  })
  @ApiBody({ type: CreateAdminRequest })
  @ApiResponse({
    status: 201,
    description: `{ "success": "true" }`,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @HttpCode(201)
  @Post('register-admin')
  @Permissions(PermissionEnum.MANAGE_ADMINS)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  async registerAdmin(
    @Req() req,
    @Res() res,
    @Body() createAdminRequest: CreateAdminRequest,
  ) {
    const createUserRequest =
      UserMapper.mapCreateAdminRequestToCreateUserRequest(createAdminRequest);
    await this.authFacade.register(createUserRequest, RoleEnum.ADMIN);
    return this.registerStrategy.send(req, res);
  }

  @ApiOperation({
    summary: 'Callback register a user. Click on the magic link',
  })
  @ApiParam({
    name: 'token',
    required: true,
    description: 'JWT token which is a part of the magic link',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: `User register in successfully`,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('magic-register'))
  @Get('register/callback')
  async callbackRegister(@Req() req): Promise<TokenResponse> {
    let user = req.user;
    user = await this.authFacade.activateUser(user);
    return await this.authFacade.generateTokens(user);
  }

  @ApiOperation({ summary: 'Login a user. Sending email with a magic link' })
  @ApiBody({ type: LoginRequest })
  @ApiResponse({
    status: 201,
    description: `{ "success": "true" }`,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @HttpCode(201)
  @Post('login')
  async login(@Req() req, @Res() res, @Body() loginRequest: LoginRequest) {
    await this.authFacade.checkLoginAbility(loginRequest.destination);
    return this.loginStrategy.send(req, res);
  }

  @ApiOperation({ summary: 'Callback login a user. Click on the magic link' })
  @ApiParam({
    name: 'token',
    required: true,
    description: 'JWT token which is a part of the magic link',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: `User logged in successfully`,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('magic-login'))
  @Get('login/callback')
  async callback(@Req() req): Promise<TokenResponse> {
    const user = req.user;
    return await this.authFacade.login(user);
  }

  @ApiOperation({ summary: 'Refresh access token with refresh token' })
  @ApiBody({ type: RefreshTokenRequest })
  @ApiResponse({
    status: 201,
    description: 'Access token refreshed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload structure',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication failed',
  })
  @Post('refresh')
  async refreshAccessToken(
    @Body() refreshTokenRequest: RefreshTokenRequest,
  ): Promise<TokenResponse> {
    const response = await this.authFacade.refreshAccessToken(
      refreshTokenRequest.refreshToken,
    );

    return response;
  }
}
