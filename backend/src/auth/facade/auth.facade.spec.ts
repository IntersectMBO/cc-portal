import { Test, TestingModule } from '@nestjs/testing';
import { AuthFacade } from './auth.facade';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from '../service/auth.service';
import { User } from '../../users/entities/user.entity';
import { Permission } from 'src/users/entities/permission.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RoleEnum } from '../../users/enums/role.enum';
import { CreateUserRequest } from 'src/users/api/request/create-user.request';
import { Role } from 'src/users/entities/role.entity';
import { TokenResponse } from '../api/response/token.response';
import { EmailService } from '../../email/service/email.service';
import { UserStatusEnum } from '../../users/enums/user-status.enum';
import { PermissionEnum } from 'src/users/enums/permission.enum';

describe('AuthFacade', () => {
  let facade: AuthFacade;

  const mockRoles: Role[] = [
    {
      id: '1',
      code: 'admin',
      users: null,
      permissions: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '2',
      code: 'super_admin',
      users: null,
      permissions: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '3',
      code: 'user',
      users: null,
      permissions: null,
      createdAt: null,
      updatedAt: null,
    },
  ];

  const mockPermissions: Permission[] = [
    {
      id: '1',
      code: 'manage_cc_members',
      roles: [mockRoles[0], mockRoles[1]],
      users: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '2',
      code: 'manage_admins',
      roles: [mockRoles[0], mockRoles[1]],
      users: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '3',
      code: 'add_constitution_version',
      roles: [mockRoles[0], mockRoles[1]],
      users: null,
      createdAt: null,
      updatedAt: null,
    },
  ];

  const mockCreatedUser: UserDto = {
    id: '3',
    name: '',
    email: 'user@example.com',
    description: '',
    profilePhotoUrl: '',
    status: UserStatusEnum.PENDING,
    hotAddresses: [],
    role: mockRoles[2].code,
    permissions: [],
    deactivatedAt: null,
    createdAt: null,
    updatedAt: null,
  };

  const mockCreatedAdmin: UserDto = {
    id: '3',
    name: '',
    email: 'admin@example.com',
    description: '',
    profilePhotoUrl: '',
    status: UserStatusEnum.PENDING,
    hotAddresses: [],
    role: mockRoles[0].code,
    permissions: [mockPermissions[0].code, mockPermissions[1].code],
    deactivatedAt: null,
    createdAt: null,
    updatedAt: null,
  };

  const mockUsers: UserDto[] = [
    {
      id: '1',
      name: 'Sofija Dokmanovic',
      email: 'sofija@example.com',
      description: 'Lorem ipsum dolor sit amet',
      profilePhotoUrl: 'https://example.com/profile.jpg',
      status: UserStatusEnum.PENDING,
      hotAddresses: ['sofija123', 'sofija234'],
      role: mockRoles[0].code,
      permissions: [mockPermissions[0].code],
      deactivatedAt: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '2',
      name: 'Ivan Ivanovic',
      email: 'ivan@example.com',
      description: 'Lorem ipsum dolor sit amet 2',
      profilePhotoUrl: 'https://example2.com/profile.jpg',
      status: UserStatusEnum.ACTIVE,
      hotAddresses: ['ivan1', 'ivan2'],
      role: mockRoles[2].code,
      permissions: [],
      deactivatedAt: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '3',
      name: 'Test User 3',
      email: 'test@test.com',
      description: 'Lorem ipsum dolor sit amet 3',
      profilePhotoUrl: 'https://example3.com/profile.jpg',
      status: UserStatusEnum.PENDING,
      hotAddresses: ['addr1', 'addr2'],
      role: mockRoles[2].code,
      permissions: [],
      deactivatedAt: null,
      createdAt: null,
      updatedAt: null,
    },
  ];

  const mockTokenResponse: TokenResponse = {
    user: mockUsers[1],
    accessToken: 'validAccessToken',
    refreshToken: 'validRefreshToken',
  };

  const mockValidateRefreshTokenPayload = {
    userId: mockUsers[1].id,
    email: mockUsers[1].email,
    role: mockUsers[1].role,
    permissions: mockUsers[1].permissions,
  };

  const mockUserService = {
    create: jest
      .fn()
      .mockImplementation(async (createUserDto: CreateUserDto) => {
        const userData: Partial<User> = {
          email: createUserDto.destination,
        };

        const existingUser = mockUsers.find(
          (user) => user.email === createUserDto.destination,
        );
        if (existingUser) {
          throw new ConflictException(
            `User with this email address already exists`,
          );
        }

        const userRole = mockRoles.find(
          (role) => role.code === createUserDto.role,
        );
        if (!userRole) {
          throw new BadRequestException(
            `Role with code ${createUserDto.role} not found`,
          );
        }

        const userPermissions = await Promise.all(
          createUserDto.permissions.map(async (permissionName) => {
            const permission = mockPermissions.find(
              (permission) => permission.code === permissionName,
            );
            if (!permission) {
              throw new BadRequestException(`Permission not found`);
            }
            return permission;
          }),
        );

        userData.role = userRole;
        userData.permissions = userPermissions;

        const newUser: UserDto = {
          id: '3',
          name: '',
          email: createUserDto.destination,
          description: '',
          profilePhotoUrl: '',
          status: UserStatusEnum.PENDING,
          hotAddresses: [],
          role: userRole.code,
          permissions: userPermissions.map((permission) => permission.code),
          deactivatedAt: null,
          createdAt: null,
          updatedAt: null,
        };

        mockUsers.push(newUser);

        return newUser;
      }),
    updateUserStatus: jest
      .fn()
      .mockImplementation(async (id: string, userStatus: UserStatusEnum) => {
        const user = mockUsers.find((user) => user.id === id);

        if (!user) {
          throw new NotFoundException(`User with this ID not found`);
        }

        user.status = userStatus;

        return {
          ...user,
          status: userStatus,
        };
      }),
    findByEmail: jest.fn().mockImplementation(async (email: string) => {
      const user = mockUsers.find((user) => user.email === email);
      if (!user) {
        throw new NotFoundException(`User with this email address not found`);
      }
      return user;
    }),
    checkRoleManagedByPermission: jest.fn(),
  };

  const mockAuthService = {
    issueAccessToken: jest.fn().mockReturnValue('validAccessToken'),
    issueRefreshToken: jest.fn().mockReturnValue('validRefreshToken'),
    validateRefreshToken: jest.fn().mockReturnValue({
      userId: mockUsers[1].id,
      address: mockUsers[1].email,
    }),
  };

  const mockEmailService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthFacade,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    facade = module.get<AuthFacade>(AuthFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  describe('Register', () => {
    it('should register a new user', async () => {
      const createUserRequest: CreateUserRequest = {
        destination: 'user@example.com',
        permissions: [],
      };
      const userRole = RoleEnum.USER;
      const result = await facade.register(createUserRequest, userRole);
      expect(result).toEqual(mockCreatedUser);
      expect(mockUserService.create).toHaveBeenCalled();
    });

    it('should register a new admin', async () => {
      const createAdminRequest: CreateUserRequest = {
        destination: 'admin@example.com',
        permissions: ['manage_cc_members', 'manage_admins'],
      };
      const adminRole = RoleEnum.ADMIN;
      const result = await facade.register(createAdminRequest, adminRole);
      expect(result).toEqual(mockCreatedAdmin);
      expect(mockUserService.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if user with given email already exists', async () => {
      const createUserRequest: CreateUserRequest = {
        destination: 'sofija@example.com', //existing email
        permissions: [],
      };
      const userRole = RoleEnum.USER;

      try {
        await facade.register(createUserRequest, userRole);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('User with this email address already exists');
      }
    });

    it('should throw BadRequestException if permission with given name is not found', async () => {
      const createUserRequest: CreateUserRequest = {
        destination: 'example@example.com',
        permissions: ['non_existing_permission'],
      };
      const userRole = RoleEnum.USER;

      try {
        await facade.register(createUserRequest, userRole);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe(`Permission not found`);
      }
    });
  });

  describe('Activate user', () => {
    it('should update user`s account status to ACTIVE if its current status is PENDING', async () => {
      const userDto: UserDto = {
        id: '1',
        name: 'Sofija Dokmanovic',
        email: 'sofija@example.com',
        description: 'Lorem ipsum dolor sit amet',
        profilePhotoUrl: 'https://example.com/profile.jpg',
        status: UserStatusEnum.PENDING,
        hotAddresses: ['sofija123', 'sofija234'],
        role: mockRoles[0].code,
        permissions: [mockPermissions[0].code],
        deactivatedAt: null,
        createdAt: null,
        updatedAt: null,
      };

      const result = await facade.activateUser(userDto);

      expect(result.status).toEqual(UserStatusEnum.ACTIVE);
      expect(mockUserService.updateUserStatus).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user with given email is not found', async () => {
      const nonExistingUserEmail = undefined;

      const userDto: UserDto = {
        id: '1',
        name: 'Sofija Dokmanovic',
        email: nonExistingUserEmail,
        description: 'Lorem ipsum dolor sit amet',
        profilePhotoUrl: 'https://example.com/profile.jpg',
        status: UserStatusEnum.PENDING,
        hotAddresses: ['sofija123', 'sofija234'],
        role: mockRoles[0].code,
        permissions: [mockPermissions[0].code],
        deactivatedAt: null,
        createdAt: null,
        updatedAt: null,
      };

      try {
        await facade.activateUser(userDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('User with this email address not found');
      }
    });
    it('should throw ConflictException if user`s current account status is not PENDING', async () => {
      const userDto: UserDto = {
        id: '1',
        name: 'Sofija Dokmanovic',
        email: 'sofija@example.com',
        description: 'Lorem ipsum dolor sit amet',
        profilePhotoUrl: 'https://example.com/profile.jpg',
        status: UserStatusEnum.ACTIVE,
        hotAddresses: ['sofija123', 'sofija234'],
        role: mockRoles[0].code,
        permissions: [mockPermissions[0].code],
        deactivatedAt: null,
        createdAt: null,
        updatedAt: null,
      };

      mockUserService.findByEmail.mockImplementationOnce(() => {
        return userDto;
      });

      try {
        await facade.activateUser(userDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('Unable to activate account');
      }
    });
  });

  describe('Validate User', () => {
    it('should find user by email', async () => {
      const email = 'sofija@example.com';
      const userDto: UserDto = {
        id: '1',
        name: 'Sofija Dokmanovic',
        email: 'sofija@example.com',
        description: 'Lorem ipsum dolor sit amet',
        profilePhotoUrl: 'https://example.com/profile.jpg',
        status: UserStatusEnum.ACTIVE,
        hotAddresses: ['sofija123', 'sofija234'],
        role: mockRoles[0].code,
        permissions: [mockPermissions[0].code],
        deactivatedAt: null,
        createdAt: null,
        updatedAt: null,
      };

      const result = await facade.findUserByEmail(email);

      expect(result).toEqual(userDto);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const email = 'non_existing@example.com';

      try {
        await facade.findUserByEmail(email);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`User with this email address not found`);
      }
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('Generate Tokens', () => {
    it('should generate access and refresh tokens for a user', async () => {
      const userDto: UserDto = {
        id: '2',
        name: 'Ivan Ivanovic',
        email: 'ivan@example.com',
        description: 'Lorem ipsum dolor sit amet 2',
        profilePhotoUrl: 'https://example2.com/profile.jpg',
        status: UserStatusEnum.ACTIVE,
        hotAddresses: ['ivan1', 'ivan2'],
        role: mockRoles[2].code,
        permissions: [],
        deactivatedAt: null,
        createdAt: null,
        updatedAt: null,
      };

      const result = await facade.generateTokens(userDto);

      expect(result.accessToken).toEqual(mockTokenResponse.accessToken);
      expect(result.refreshToken).toEqual(mockTokenResponse.refreshToken);
      expect(result.user).toEqual(mockTokenResponse.user);
    });
  });

  describe('Refresh Access Token', () => {
    it('should refresh access token', async () => {
      const refreshToken = 'validRefreshToken';

      mockAuthService.validateRefreshToken.mockReturnValue(
        mockValidateRefreshTokenPayload,
      );
      mockUserService.findByEmail.mockResolvedValue(mockUsers[1]);

      const result = await facade.refreshAccessToken(refreshToken);

      expect(mockAuthService.validateRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        mockUsers[1].email,
      );

      expect(result).toEqual(mockTokenResponse);
    });

    it('should throw an error for an invalid refresh token', async () => {
      const refreshToken = 'invalidRefreshToken';

      mockAuthService.validateRefreshToken.mockReturnValue(null);

      await expect(facade.refreshAccessToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an error if user does not exist', async () => {
      const refreshToken = 'validRefreshToken';
      const nonExistantUserPayload = {
        userId: 'nonexistentUserId',
        email: '0xnonexistentAddress',
      };

      mockAuthService.validateRefreshToken.mockReturnValue(
        nonExistantUserPayload,
      );
      mockUserService.findByEmail.mockRejectedValue(new NotFoundException());

      await expect(facade.refreshAccessToken(refreshToken)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if user ID does not match', async () => {
      const refreshToken = 'validRefreshToken';
      const differentUserPayload = {
        userId: 'differentUserId',
        email: mockUsers[1].email,
      };

      mockAuthService.validateRefreshToken.mockReturnValue(
        differentUserPayload,
      );
      mockUserService.findByEmail.mockResolvedValue(mockUsers[1]);

      await expect(facade.refreshAccessToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('Check Ability Resend Register Invite', () => {
    it('should call checkRoleManagedByPermission if user status is PENDING', async () => {
      const mockUser = mockUsers[2];
      jest.spyOn(facade, 'findUserByEmail').mockResolvedValue(mockUser);
      const permissions = [PermissionEnum.MANAGE_CC_MEMBERS];

      await facade.checkAbilityResendRegisterInvite(
        mockUser.email,
        permissions,
      );

      expect(facade.findUserByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(mockUserService.checkRoleManagedByPermission).toHaveBeenCalledWith(
        mockUser.role,
        permissions,
      );
    });

    it(`should throw error if user's status is not PENDING`, async () => {
      const mockUser = mockUsers[1];
      jest.spyOn(facade, 'findUserByEmail').mockResolvedValue(mockUser);
      const permissions = [PermissionEnum.MANAGE_CC_MEMBERS];

      try {
        await facade.checkAbilityResendRegisterInvite(
          mockUser.email,
          permissions,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.status).toEqual(409);
        expect(e.message).toEqual(`Unable to resend register invite`);
      }
    });

    it('should throw NotFoundException if user with given email is not found', async () => {
      const mockUser = mockUsers[2];
      mockUser.email = 'not-existing-email@test.com';
      jest
        .spyOn(facade, 'findUserByEmail')
        .mockRejectedValue(
          new NotFoundException(`User with this email address not found`),
        );
      const permissions = [PermissionEnum.MANAGE_CC_MEMBERS];
      try {
        await facade.checkAbilityResendRegisterInvite(
          mockUser.email,
          permissions,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toEqual(404);
        expect(e.message).toEqual(`User with this email address not found`);
      }
    });

    it('should call checkRoleManagedByPermission if user status is PENDING', async () => {
      const mockUser = mockUsers[2];
      mockUser.role = RoleEnum.ADMIN;
      jest.spyOn(facade, 'findUserByEmail').mockResolvedValue(mockUser);
      const permissions = [PermissionEnum.ADD_CONSTITUTION];

      try {
        await facade.checkAbilityResendRegisterInvite(
          mockUser.email,
          permissions,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.status).toEqual(403);
        expect(e.message).toEqual(`You have no permission for this action`);
      }
    });
  });
});
