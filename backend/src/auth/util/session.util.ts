import { UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { UserStatusEnum } from 'src/users/enums/user-status.enum';

/**
 * Checks that a token issued at `issuedAt` (JWT `iat`, in seconds) may still
 * be used by the given user: the account must be active, and tokens issued
 * before the user was last deactivated are no longer accepted.
 */
export function assertTokenAllowedForUser(
  user: UserDto,
  issuedAt: number | undefined,
): void {
  if (user.status !== UserStatusEnum.ACTIVE) {
    throw new UnauthorizedException('User is not active');
  }
  if (user.deactivatedAt) {
    const deactivatedAtSeconds = Math.floor(
      new Date(user.deactivatedAt).getTime() / 1000,
    );
    if (typeof issuedAt !== 'number' || issuedAt <= deactivatedAtSeconds) {
      throw new UnauthorizedException('Session is no longer valid');
    }
  }
}
