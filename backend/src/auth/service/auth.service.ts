import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  issueAccessToken(payload: any): string {
    return jwt.sign(payload, this.configService.getOrThrow('ACCESS_SECRET'), {
      expiresIn: this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  issueRefreshToken(payload: any): string {
    return jwt.sign(payload, this.configService.getOrThrow('REFRESH_SECRET'), {
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });
  }

  validateRefreshToken(
    refreshToken: string,
  ): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(
        refreshToken,
        this.configService.getOrThrow('REFRESH_SECRET'),
      ) as jwt.JwtPayload;

      // Check if the decoded payload has userId and address
      if (
        decoded &&
        typeof decoded === 'object' &&
        'userId' in decoded &&
        'email' in decoded
      ) {
        return { userId: decoded.userId, email: decoded.email };
      } else {
        // If the necessary fields are not in the decoded payload, throw an error
        throw new BadRequestException('Invalid payload structure');
      }
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
