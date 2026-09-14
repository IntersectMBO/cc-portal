import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersFacade } from '../facade/users.facade';
import { PermissionEnum } from '../enums/permission.enum';
import { ToggleStatusRequest } from './request/toggle-status.request';
import { UpdateRoleAndPermissionsRequest } from './request/update-role-and-permissions.request';

describe('UsersController (IDOR fix #635)', () => {
  let controller: UsersController;
  let facade: UsersFacade;

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
    facade = module.get<UsersFacade>(UsersFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toggleStatus', () => {
    it('operates on the validated path :id, ignoring spoofed body.userId', async () => {
      const pathId = '82dbbfb1-2552-4aaf-a9a7-1195497410c0';
      const attackBody: ToggleStatusRequest = {
        userId: '00000000-0000-0000-0000-000000000000', // attacker-controlled victim id
        status: 'inactive',
      } as ToggleStatusRequest;
      const permissions: PermissionEnum[] = [PermissionEnum.MANAGE_CC_MEMBERS];

      await controller.toggleStatus(
        { user: { userId: pathId, permissions } },
        pathId,
        attackBody,
      );

      // The facade must receive the path id as the target, never the body.id.
      expect(mockToggleStatus).toHaveBeenCalledTimes(1);
      expect(mockToggleStatus.mock.calls[0][0].userId).toBe(pathId);
    });
  });

  describe('removeUser', () => {
    it('operates on the validated path :id, ignoring spoofed body.userId', async () => {
      const callerId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      const victimId = '82dbbfb1-2552-4aaf-a9a7-1195497410c0';
      // Attacker puts their own id in path (to pass the old guard) and a
      // spoofed victim id in the body. The fix must act on the path id.
      const attackBody = { userId: '00000000-0000-0000-0000-000000000000' };

      await controller.removeUser(
        { user: { userId: callerId } },
        victimId,
        attackBody,
      );

      expect(mockRemoveUser).toHaveBeenCalledTimes(1);
      expect(mockRemoveUser).toHaveBeenCalledWith(victimId);
    });

    it('throws BadRequest when the caller tries to delete themself', async () => {
      const pathId = '82dbbfb1-2552-4aaf-a9a7-1195497410c0';
      await expect(
        controller.removeUser({ user: { userId: pathId } }, pathId, {
          userId: pathId,
        }),
      ).rejects.toThrow('You cannot delete yourself');
      expect(mockRemoveUser).not.toHaveBeenCalled();
    });
  });

  describe('updateUserRoleAndPermissions', () => {
    it('operates on the validated path :id, ignoring spoofed body.userId', async () => {
      const pathId = '82dbbfb1-2552-4aaf-a9a7-1195497410c0';
      const attackBody: UpdateRoleAndPermissionsRequest = {
        userId: '00000000-0000-0000-0000-000000000000',
        newRole: 'admin',
        newPermissions: ['manage_cc_members'],
      } as UpdateRoleAndPermissionsRequest;

      await controller.updateUserRoleAndPermissions(pathId, attackBody);

      expect(mockUpdateRoleAndPermissions).toHaveBeenCalledTimes(1);
      expect(mockUpdateRoleAndPermissions.mock.calls[0][0].userId).toBe(pathId);
    });
  });
});