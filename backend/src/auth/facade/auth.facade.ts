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
import { EmailService } from 'src/email/service/email.service';
import { EmailDto } from 'src/email/dto/email.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserStatusEnum } from 'src/users/entities/user.entity';
import { RoleEnum } from 'src/users/entities/role.entity';
import { PermissionAdminEnum } from 'src/users/entities/permission.entity';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async registerUser(createUser: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.create(createUser);

    return user;
  }

  async updateWhitelistedAndStatus(userDto: UserDto): Promise<UserDto> {
    let user = await this.usersService.toggleWhitelist(userDto.id, true);
    user = await this.usersService.updateUserStatus(
      userDto.id,
      UserStatusEnum.ACTIVE,
    );
    return user;
  }

  async validateUser(email: string): Promise<UserDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with ${email} not found`);
    }
    return user;
  }

  async generateTokens(userDto: UserDto): Promise<TokenResponse> {
    // if (!userDto.whitelisted) {
    //   throw new ForbiddenException(`User is not whitelisted`);
    // }
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

  async sendEmail(emailDto: EmailDto): Promise<void> {
    await this.emailService.sendEmail(emailDto);
  }

  async checkAdminPermissionsAndRoles(
    permissions: string[],
    roles: string[],
  ): Promise<boolean> {
    for (const role of roles) {
      if (role === RoleEnum.ADMIN) {
        for (const permission of permissions) {
          if (permission === PermissionAdminEnum.ADD_ADMIN) {
            return true;
          }
        }
        return false;
      }
    }
    return true;
  }
}
