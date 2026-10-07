import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, timingSafeEqual } from 'crypto';
import { Request } from 'express';

export const API_KEY_HEADER = 'x-api-key';

/**
 * Restricts an endpoint to callers that present the shared
 * IPFS_SERVICE_API_KEY (i.e. the backend). Requests are rejected when the
 * key is not configured.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expectedKey = this.configService.get<string>('IPFS_SERVICE_API_KEY');
    if (!expectedKey) {
      this.logger.error(
        'IPFS_SERVICE_API_KEY is not set; rejecting write request',
      );
      throw new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const providedKey = request.headers[API_KEY_HEADER];
    if (
      typeof providedKey !== 'string' ||
      !ApiKeyGuard.keysMatch(providedKey, expectedKey)
    ) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private static keysMatch(provided: string, expected: string): boolean {
    // Compare fixed-length digests so the comparison time does not depend
    // on the key length or content.
    const a = createHash('sha256').update(provided).digest();
    const b = createHash('sha256').update(expected).digest();
    return timingSafeEqual(a, b);
  }
}
