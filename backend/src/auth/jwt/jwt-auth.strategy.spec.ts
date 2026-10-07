import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/services/users.service';
import { UserStatusEnum } from 'src/users/enums/user-status.enum';
import { JwtAuthStrategy } from './jwt-auth.strategy';

describe('JwtAuthStrategy', () => {
  const mockUsersService = {
    findById: jest.fn(),
  };
  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('test_access_secret'),
  };

  const strategy = new JwtAuthStrategy(
    mockConfigService as unknown as ConfigService,
    mockUsersService as unknown as UsersService,
  );

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    userId: '1',
    email: 'admin@example.com',
    role: 'admin',
    permissions: ['manage_cc_members', 'manage_admins'],
    iat: now,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the current role and permissions of an active user', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: '1',
      email: 'admin@example.com',
      role: 'admin',
      permissions: ['manage_cc_members'],
      status: UserStatusEnum.ACTIVE,
      deactivatedAt: null,
    });

    const user = await strategy.validate(payload);

    expect(mockUsersService.findById).toHaveBeenCalledWith('1');
    expect(user).toEqual({
      ...payload,
      permissions: ['manage_cc_members'],
    });
  });

  it('rejects inactive users', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: '1',
      status: UserStatusEnum.INACTIVE,
      deactivatedAt: new Date(),
    });

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects tokens issued before the user was last deactivated', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: '1',
      status: UserStatusEnum.ACTIVE,
      deactivatedAt: new Date((now + 60) * 1000),
    });

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects users that no longer exist', async () => {
    mockUsersService.findById.mockRejectedValue(new NotFoundException());

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects tokens without a user id', async () => {
    await expect(
      strategy.validate({ ...payload, userId: undefined }),
    ).rejects.toThrow(UnauthorizedException);
    expect(mockUsersService.findById).not.toHaveBeenCalled();
  });
});
