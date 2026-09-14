import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersFacade } from '../facade/users.facade';
import { PermissionEnum } from '../enums/permission.enum';
import { ToggleStatusRequest } from './request/toggle-status.request';
import { UpdateRoleAndPermissionsRequest } from './request/update-role-and-permissions.request';

describe('UsersController', () => {
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
    it('uses the path id as the target user', async () => {
      const pathId = '82dbbfb1-2552-4aaf-a9a7-1195497410c0';
      const body: ToggleStatusRequest = {
        userId: '00000000-0000-0000-0000-000000000000',
        status: 'inactive',
      } as ToggleStatusRequest;
      const permissions: PermissionEnum[] = [PermissionEnum.MANAGE_CC_MEMBERS];

      await controller.toggleStatus(
        { user: { userId: pathId, permissions } },
        pathId,
        body,
      );

      // The facade must receive the path id as the target.
      expect(mockToggleStatus).toHaveBeenCalledTimes(1);
      expect(mockToggleStatus.mock.calls[0][0].userId).toBe(pathId);
    });
  });

  describe('removeUser', () => {
    it('uses the path id as the target user', async () => {
      const callerId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      const targetId = '82dbbfb1-2552-4aaf-a9a7-1195497410c0';
      const body = { userId: '00000000-0000-0000-0000-000000000000' };

      await controller.removeUser(
        { user: { userId: callerId } },
        targetId,
        body,
      );

      expect(mockRemoveUser).toHaveBeenCalledTimes(1);
      expect(mockRemoveUser).toHaveBeenCalledWith(targetId);
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
    it('uses the path id as the target user', async () => {
      const pathId = '82dbbfb1-2552-4aaf-a9a7-1195497410c0';
      const body: UpdateRoleAndPermissionsRequest = {
        userId: '00000000-0000-0000-0000-000000000000',
        newRole: 'admin',
        newPermissions: ['manage_cc_members'],
      } as UpdateRoleAndPermissionsRequest;

      await controller.updateUserRoleAndPermissions(pathId, body);

      expect(mockUpdateRoleAndPermissions).toHaveBeenCalledTimes(1);
      expect(mockUpdateRoleAndPermissions.mock.calls[0][0].userId).toBe(pathId);
    });
  });
});