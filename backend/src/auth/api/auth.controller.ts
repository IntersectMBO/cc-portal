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
import { MagicLoginStrategy } from '../magiclogin/magiclogin.strategy';
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authFacade: AuthFacade,
    private readonly strategy: MagicLoginStrategy,
  ) {}

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
    await this.authFacade.validateUser(loginRequest.destination);
    return this.strategy.send(req, res);
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
    return await this.authFacade.generateTokens(user);
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
