import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersFacade } from '../facade/users.facade';
import { PermissionEnum } from '../enums/permission.enum';
import { UserStatusEnum } from '../enums/user-status.enum';
import { ToggleStatusRequest } from './request/toggle-status.request';
import { UpdateRoleAndPermissionsRequest } from './request/update-role-and-permissions.request';
import { PermissionGuard } from '../../auth/guard/permission.guard';
import { UserPathGuard } from '../../auth/guard/users-path.guard';

describe('UsersController', () => {
  let controller: UsersController;

  const callerId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const targetId = '82dbbfb1-2552-4aaf-a9a7-1195497410c0';

  const mockToggleStatus = jest.fn();
  const mockRemoveUser = jest.fn();
  const mockUpdateRoleAndPermissions = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersFacade,
          useValue: {
            toggleStatus: mockToggleStatus,
            removeUser: mockRemoveUser,
            updateUserRoleAndPermissions: mockUpdateRoleAndPermissions,
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const guardsOf = (handler: (...args: any[]) => any) =>
    Reflect.getMetadata('__guards__', handler) ?? [];
  const permissionsOf = (handler: (...args: any[]) => any) =>
    Reflect.getMetadata('permissions', handler) ?? [];

  describe('toggleStatus', () => {
    it('uses the path id as the target user', async () => {
      const permissions: PermissionEnum[] = [PermissionEnum.MANAGE_CC_MEMBERS];
      const body: ToggleStatusRequest = { status: UserStatusEnum.INACTIVE };

      await controller.toggleStatus(
        { user: { userId: callerId, permissions } },
        targetId,
        body,
      );

      expect(mockToggleStatus).toHaveBeenCalledTimes(1);
      expect(mockToggleStatus).toHaveBeenCalledWith(
        targetId,
        UserStatusEnum.INACTIVE,
        permissions,
      );
    });

    it('rejects changing your own status', async () => {
      await expect(
        controller.toggleStatus(
          {
            user: {
              userId: callerId,
              permissions: [PermissionEnum.MANAGE_ADMINS],
            },
          },
          callerId,
          { status: UserStatusEnum.INACTIVE },
        ),
      ).rejects.toThrow(BadRequestException);
      expect(mockToggleStatus).not.toHaveBeenCalled();
    });

    it('requires a user management permission', () => {
      expect(guardsOf(UsersController.prototype.toggleStatus)).toContain(
        PermissionGuard,
      );
      expect(guardsOf(UsersController.prototype.toggleStatus)).not.toContain(
        UserPathGuard,
      );
      expect(permissionsOf(UsersController.prototype.toggleStatus)).toEqual(
        expect.arrayContaining([
          PermissionEnum.MANAGE_CC_MEMBERS,
          PermissionEnum.MANAGE_ADMINS,
        ]),
      );
    });
  });

  describe('removeUser', () => {
    it('uses the path id as the target user', async () => {
      await controller.removeUser({ user: { userId: callerId } }, targetId);

      expect(mockRemoveUser).toHaveBeenCalledTimes(1);
      expect(mockRemoveUser).toHaveBeenCalledWith(targetId);
    });

    it('throws BadRequest when the caller tries to delete themself', async () => {
      await expect(
        controller.removeUser({ user: { userId: callerId } }, callerId),
      ).rejects.toThrow('You cannot delete yourself');
      expect(mockRemoveUser).not.toHaveBeenCalled();
    });

    it('requires the manage_admins permission', () => {
      expect(guardsOf(UsersController.prototype.removeUser)).toContain(
        PermissionGuard,
      );
      expect(permissionsOf(UsersController.prototype.removeUser)).toEqual([
        PermissionEnum.MANAGE_ADMINS,
      ]);
    });
  });

  describe('updateUserRoleAndPermissions', () => {
    const body: UpdateRoleAndPermissionsRequest = {
      newRole: 'admin',
      newPermissions: [PermissionEnum.MANAGE_CC_MEMBERS],
    };

    it('uses the path id as the target user', async () => {
      await controller.updateUserRoleAndPermissions(
        { user: { userId: callerId } },
        targetId,
        body,
      );

      expect(mockUpdateRoleAndPermissions).toHaveBeenCalledTimes(1);
      expect(mockUpdateRoleAndPermissions).toHaveBeenCalledWith(targetId, body);
    });

    it('rejects changing your own role and permissions', async () => {
      await expect(
        controller.updateUserRoleAndPermissions(
          { user: { userId: callerId } },
          callerId,
          body,
        ),
      ).rejects.toThrow(BadRequestException);
      expect(mockUpdateRoleAndPermissions).not.toHaveBeenCalled();
    });

    it('requires the manage_roles_and_permissions permission', () => {
      expect(
        guardsOf(UsersController.prototype.updateUserRoleAndPermissions),
      ).toContain(PermissionGuard);
      expect(
        permissionsOf(UsersController.prototype.updateUserRoleAndPermissions),
      ).toEqual([PermissionEnum.MANAGE_ROLES_AND_PERMISSIONS]);
    });
  });
});
