import { Test, TestingModule } from '@nestjs/testing';
import { UsersFacade } from './users.facade';
import { UsersService } from '../services/users.service';
import { NotFoundException } from '@nestjs/common';
import { UserStatusEnum } from '../enums/user-status.enum';
import { UserDto } from '../dto/user.dto';
import { Permission } from '../entities/permission.entity';
import { S3Service } from '../../s3/service/s3.service';
import { RoleDto } from '../dto/role.dto';
import { Role } from '../entities/role.entity';

describe('UsersFacade', () => {
  let facade: UsersFacade;

  let mockRoles: Role[] = [
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
      code: 'add_new_admin',
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

  const mockUsers: UserDto[] = [
    {
      id: '1',
      name: 'Sofija Dokmanovic',
      email: 'sofija@example.com',
      description: 'Lorem ipsum dolor sit amet',
      profilePhotoUrl: 'https:/example.com/profile.jpg',
      status: UserStatusEnum.PENDING,
      hotAddresses: ['sofija123', 'sofija234'],
      role: mockRoles[0].code,
      permissions: [mockPermissions[0].code],
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
      createdAt: null,
      updatedAt: null,
    },
  ];

  let mockUsers2: UserDto[] = [
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
      createdAt: null,
      updatedAt: null,
    },
  ];

  const mockUserService = {
    findAll: jest.fn().mockImplementation(() => {
      if (!mockUsers2 || mockUsers2.length === 0) {
        return [] as UserDto[];
      }
      return mockUsers2;
    }),
    getAllRoles: jest.fn().mockImplementation(() => {
      if (!mockRoles || mockRoles.length === 0) {
        return [] as RoleDto[];
      }
      return mockRoles;
    }),
    findById: jest.fn().mockImplementation((id) => {
      let foundUser: UserDto;
      mockUsers.forEach((item) => {
        if (id === item.id) {
          foundUser = item;
        }
      });
      if (!foundUser) {
        return new NotFoundException(`User with id ${id} not found`);
      }
      return foundUser;
    }),
  };

  const mockS3Service = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersFacade,
        { provide: S3Service, useValue: mockS3Service },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    facade = module.get<UsersFacade>(UsersFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  describe('Fetch a user by id', () => {
    it('should return a user by id', async () => {
      const id = mockUsers[0].id;
      const user = await facade.findOne(id);
      expect(mockUserService.findById).toHaveBeenCalled();
      expect(user).toMatchObject(mockUsers[0]);
    });
    it('should not return a user by id', async () => {
      const id = 'wrong-user-id';
      try {
        await facade.findOne(id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`User with id ${id} not found`);
      }
    });
  });

  describe('Fetch all users', () => {
    it('should return an array of users', async () => {
      const users = await facade.findAll();

      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(users).toMatchObject(mockUsers2);
    });
    it('should not return an array of users', async () => {
      mockUsers2 = [];
      const result = await facade.findAll();
      expect(result.length).toBe(0);
    });
  });

  describe('Fetch all roles', () => {
    it('should return an array of roles', async () => {
      const roles = await facade.getAllRoles();

      expect(mockUserService.getAllRoles).toHaveBeenCalled();
      expect(roles).toMatchObject(mockRoles);
    });
    it('should not return an array of roles', async () => {
      mockRoles = [];
      const result = await facade.getAllRoles();
      expect(result.length).toBe(0);
    });
  });
});
