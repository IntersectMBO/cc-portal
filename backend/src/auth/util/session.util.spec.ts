import { UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { UserStatusEnum } from 'src/users/enums/user-status.enum';
import { assertTokenAllowedForUser } from './session.util';

describe('assertTokenAllowedForUser', () => {
  const user = (overrides: Partial<UserDto>): UserDto =>
    ({
      id: '1',
      email: 'user@example.com',
      status: UserStatusEnum.ACTIVE,
      deactivatedAt: null,
      ...overrides,
    }) as UserDto;

  const deactivatedAt = new Date('2026-01-01T12:00:00.000Z');
  const deactivatedAtSeconds = deactivatedAt.getTime() / 1000;

  it('allows active users', () => {
    expect(() =>
      assertTokenAllowedForUser(user({}), deactivatedAtSeconds),
    ).not.toThrow();
  });

  it.each([UserStatusEnum.INACTIVE, UserStatusEnum.PENDING])(
    'rejects users with status %s',
    (status) => {
      expect(() =>
        assertTokenAllowedForUser(user({ status }), deactivatedAtSeconds),
      ).toThrow(UnauthorizedException);
    },
  );

  it('rejects tokens issued before the last deactivation', () => {
    expect(() =>
      assertTokenAllowedForUser(
        user({ deactivatedAt }),
        deactivatedAtSeconds - 60,
      ),
    ).toThrow(UnauthorizedException);
  });

  it('rejects tokens without an issue time once the user was deactivated', () => {
    expect(() =>
      assertTokenAllowedForUser(user({ deactivatedAt }), undefined),
    ).toThrow(UnauthorizedException);
  });

  it('allows tokens issued after the user was reactivated', () => {
    expect(() =>
      assertTokenAllowedForUser(
        user({ deactivatedAt }),
        deactivatedAtSeconds + 60,
      ),
    ).not.toThrow();
  });
});
