import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/services/users.service';
import { UserDto } from 'src/users/dto/user.dto';
import { assertTokenAllowedForUser } from '../util/session.util';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    if (typeof payload?.userId !== 'string' || !payload.userId) {
      throw new UnauthorizedException();
    }
    let user: UserDto;
    try {
      user = await this.usersService.findById(payload.userId);
    } catch (e) {
      throw new UnauthorizedException();
    }
    assertTokenAllowedForUser(user, payload.iat);
    // Use the current role and permissions rather than the ones captured
    // in the token when it was issued
    return {
      ...payload,
      email: user.email,
      role: user.role,
      permissions: user.permissions ?? [],
    };
  }
}
