import { UsersService } from '../../users/services/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import { TokenResponse } from '../api/response/token.response';
import { UserMapper } from '../../users/mapper/userMapper.mapper';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { EmailService } from '../../email/service/email.service';
import { EmailDto } from 'src/email/dto/email.dto';
import { UserStatusEnum } from '../../users/enums/user-status.enum';
import { CreateUserRequest } from 'src/users/api/request/create-user.request';
import { RoleEnum } from 'src/users/enums/role.enum';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async register(
    createUserRequest: CreateUserRequest,
    role: RoleEnum,
  ): Promise<UserDto> {
    const createUserDto =
      UserMapper.mapCreateUserRequestToDto(createUserRequest);
    createUserDto.role = role;
    const user = await this.usersService.create(createUserDto);

    return user;
  }

  async activateUser(userDto: UserDto): Promise<UserDto> {
    const targetUser = await this.usersService.findByEmail(userDto.email);
    if (targetUser.status !== UserStatusEnum.PENDING) {
      throw new ConflictException(`Unable to activate user`);
    }
    const user = await this.usersService.updateUserStatus(
      userDto.id,
      UserStatusEnum.ACTIVE,
    );
    return user;
  }

  // validateUser checks user by email
  async validateUser(email: string): Promise<UserDto> {
    const user = await this.usersService.findByEmail(email);
    return user;
  }

  async login(userDto: UserDto): Promise<TokenResponse> {
    await this.checkLoginAbility(userDto.email);
    return this.generateTokens(userDto);
  }

  // checkLoginAbility checks whether the user can login according to his status
  async checkLoginAbility(email: string): Promise<void> {
    const user = await this.validateUser(email);
    if (user.status !== UserStatusEnum.ACTIVE) {
      throw new BadRequestException(`User is not active`);
    }
  }

  async generateTokens(userDto: UserDto): Promise<TokenResponse> {
    const payload = {
      userId: userDto.id,
      email: userDto.email,
      role: userDto.role,
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
}
