import { UsersService } from 'src/users/services/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import { TokenResponse } from '../api/response/token.response';
import { UserMapper } from 'src/users/mapper/userMapper.mapper';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string): Promise<UserDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with ${email} not found`);
    }
    return user;
  }

  async generateTokens(userDto: UserDto): Promise<TokenResponse> {
    if (!userDto.whitelisted) {
      throw new ForbiddenException(`User is not whitelisted`);
    }
    const payload = {
      userId: userDto.id,
      email: userDto.email,
      roles: userDto.roles,
      permissions: userDto.permissions,
    };

    const result = new TokenResponse();
    result.user = UserMapper.mapUserDtoToResponse(userDto);
    result.accessToken = this.authService.issueAccessToken(payload);
    result.refreshToken = this.authService.issueRefreshToken(payload);
    return result;
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    // Validate the refresh token and extract payload
    const payload = this.authService.validateRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Extract userId and address from the payload
    const { userId, email } = payload;

    // Make sure the user still exists and is valid
    const user = await this.usersService.findByEmail(email);
    if (!user || user.id !== userId) {
      throw new UnauthorizedException('Authentication failed');
    }

    if (!user.whitelisted) {
      throw new ForbiddenException('User is not whitelisted');
    }

    // Issue new access token using the same payload
    const result = new TokenResponse();
    result.user = UserMapper.mapUserDtoToResponse(user);
    result.accessToken = this.authService.issueAccessToken({ userId, email });
    result.refreshToken = this.authService.issueRefreshToken({ userId, email });

    return result;
  }
}
