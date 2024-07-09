import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '../../s3/service/s3.service';
import { Permission } from '../entities/permission.entity';
import { HotAddress } from '../entities/hotaddress.entity';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { UserStatusEnum } from '../enums/user-status.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginatedDto } from 'src/util/pagination/dto/paginated.dto';
import { UserDto } from '../dto/user.dto';
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { Paginator } from 'src/util/pagination/paginator';
import { RoleEnum } from '../enums/role.enum';
const mockS3Service = {
  uploadFileMinio: jest.fn().mockResolvedValue('mocked_file_name'),
  createBucketIfNotExists: jest.fn().mockResolvedValue('new_bucket'),
  getFileUrl: jest.fn().mockResolvedValue('mocked_file_url'),
};

const user: User = {
  id: 'mockedId',
  name: 'John Doe',
  email: 'mockedEmail',
  description: 'mockedDescription',
  profilePhotoUrl: 'mockedProfilePhoto',
  status: UserStatusEnum.ACTIVE,
  role: {
    id: 'roleId3',
    code: RoleEnum.USER,
    users: [],
    permissions: [],
    createdAt: null,
    updatedAt: null,
  },
  permissions: null,
  hotAddresses: null,
  isDeleted: false,
  createdAt: null,
  updatedAt: null,
};
const mockHotAdd: HotAddress = {
  id: 'mockId',
  address: 'mockedHotAddress',
  createdAt: null,
  updatedAt: null,
  user: user,
};

const mockPermissions: Permission[] = [
  {
    id: 'permissionId1',
    code: 'manage_cc_members',
    roles: [],
    users: [],
    createdAt: null,
    updatedAt: null,
  },
  {
    id: 'permissionId2',
    code: 'add_constitution_version',
    roles: [],
    users: [],
    createdAt: null,
    updatedAt: null,
  },
  {
    id: 'permissionId3',
    code: 'add_new_admin',
    roles: [],
    users: [],
    createdAt: null,
    updatedAt: null,
  },
  {
    id: 'permissionId4',
    code: 'manage_permissions',
    roles: [],
    users: [],
    createdAt: null,
    updatedAt: null,
  },
];
let mockRoles: Role[] = [
  {
    id: 'roleId1',
    code: 'super_admin',
    users: [],
    permissions: [
      mockPermissions[0],
      mockPermissions[1],
      mockPermissions[2],
      mockPermissions[3],
    ],
    createdAt: null,
    updatedAt: null,
  },
  {
    id: 'roleId2',
    code: 'admin',
    users: [],
    permissions: [mockPermissions[0], mockPermissions[1]],
    createdAt: null,
    updatedAt: null,
  },
  {
    id: 'roleId3',
    code: 'user',
    users: [],
    permissions: [],
    createdAt: null,
    updatedAt: null,
  },
];

const mockUsers: User[] = [
  {
    id: 'mockedId',
    name: 'John Doe',
    email: 'mockedEmail',
    hotAddresses: [],
    description: 'mockedDescription',
    profilePhotoUrl: 'mockedProfilePhoto',
    status: UserStatusEnum.ACTIVE,
    role: mockRoles[2],
    permissions: [],
    isDeleted: false,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: 'mockedId2',
    name: 'Sofija',
    email: 'sofija@gmail.com',
    hotAddresses: [],
    description: 'mockedDescription2',
    profilePhotoUrl: 'mockedProfilePhoto2',
    status: UserStatusEnum.ACTIVE,
    role: mockRoles[1],
    permissions: [mockPermissions[0], mockPermissions[1]],
    isDeleted: false,
    createdAt: null,
    updatedAt: null,
  },
];

const paginatedValue: Paginated<User> = {
  data: new Array<User>(user),
  meta: {
    currentPage: 0,
    itemsPerPage: 10,
    totalItems: 1,
    search: null,
    totalPages: 3,
    sortBy: null,
    searchBy: null,
    select: null,
  },
  links: {
    current: null,
  },
};

const paginatedEmptyValue: Paginated<User> = {
  data: [],
  meta: {
    currentPage: 0,
    itemsPerPage: 10,
    totalItems: 0,
    search: null,
    totalPages: 0,
    sortBy: null,
    searchBy: null,
    select: null,
  },
  links: {
    current: null,
  },
};
const paginatedMultiValue: Paginated<User> = {
  data: mockUsers,
  meta: {
    currentPage: 0,
    itemsPerPage: 10,
    totalItems: 2,
    search: null,
    totalPages: 0,
    sortBy: null,
    searchBy: null,
    select: null,
  },
  links: {
    current: null,
  },
};

const mockPaginator = {
  paginate: jest.fn().mockResolvedValue(paginatedValue),
};

const mockUserRepository = {
  create: jest.fn().mockImplementation((user) => {
    return user;
  }),
  createQueryBuilder: jest.fn().mockImplementation(function () {
    return mockUserRepository;
  }),
  leftJoinAndSelect: jest.fn().mockImplementation(function () {
    return mockUserRepository;
  }),
  where: jest.fn().mockImplementation(function () {
    return mockUserRepository;
  }),
  andWhere: jest.fn().mockImplementation(function () {
    return mockUserRepository;
  }),
  save: jest.fn().mockImplementation((user) => {
    return user;
  }),
  findOne: jest.fn().mockImplementation((id) => {
    const foundUser = mockUsers.find((user) => user.id === id.where.id);
    if (!foundUser) {
      return null;
    }
    return foundUser;
  }),
  find: jest.fn().mockImplementation((ids?) => {
    if (ids) {
      const result = mockUsers.filter((o1) =>
        ids.where.id.value.some((o2) => o1.id === o2),
      );
      return result;
    }
    if (!mockUsers) {
      return [] as string[];
    }
    return mockUsers;
  }),
  count: jest.fn().mockResolvedValue(mockUsers.length),
};
const mockRoleRepository = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockResolvedValue({}),
  findOne: jest.fn().mockImplementation((criteria) => {
    const foundRole = mockRoles.find(
      (role) => role.code === criteria.where.code,
    );
    if (!foundRole) {
      throw new NotFoundException('Role not found');
    }
    return foundRole;
  }),
  find: jest.fn().mockImplementation(() => {
    return mockRoles;
  }),
};
const mockPermRepository = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockResolvedValue({}),
  findOne: jest.fn().mockImplementation((criteria) => {
    const foundPermission = mockPermissions.find(
      (permission) => permission.code === criteria.where.code,
    );
    if (!foundPermission) {
      throw new NotFoundException('Permission not found');
    }
    return foundPermission;
  }),
};
const mockHotAddressRepository = {
  create: jest.fn().mockImplementation((hotAdd: string[]) => {
    return hotAdd;
  }),
  save: jest.fn().mockImplementation((hotAdd: string[]) => {
    return hotAdd;
  }),
  findOne: jest.fn().mockImplementation((add) => {
    if (add.where.address === mockHotAdd.address) {
      throw new ConflictException('hot address already exist');
    }
    return null;
  }),
};

const mockEntityManager = {
  transaction: jest.fn().mockImplementation(async (callback) => {
    try {
      const result = await callback();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }),
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: S3Service, useValue: mockS3Service },
        { provide: Paginator, useValue: mockPaginator },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Role), useValue: mockRoleRepository },
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermRepository,
        },
        {
          provide: getRepositoryToken(HotAddress),
          useValue: mockHotAddressRepository,
        },
        { provide: EntityManager, useValue: mockEntityManager },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Create a CC member POST api/auth/register-user && api/auth/register-admin', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should create new user', async () => {
      const createUserDto: CreateUserDto = {
        destination: 'user@gmail.com',
        role: mockRoles[2].code,
        permissions: [],
      };
      const createdCCMember = await service.create(createUserDto);
      expect(createdCCMember.email).toEqual(createUserDto.destination);
      expect(createdCCMember.role).toEqual(createUserDto.role);
      expect(createdCCMember.permissions).toEqual([]);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should create new admin', async () => {
      const createUserDto: CreateUserDto = {
        destination: 'admin@gmail.com',
        role: mockRoles[1].code,
        permissions: [mockPermissions[0].code, mockPermissions[1].code],
      };
      const createdCCMember = await service.create(createUserDto);
      expect(createdCCMember.email).toEqual(createUserDto.destination);
      expect(createdCCMember.role).toEqual(createUserDto.role);
      expect(createdCCMember.permissions).toEqual(createUserDto.permissions);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if user with the same email already exists', async () => {
      //mock findOne method to return an existing user with the same email
      mockUserRepository.findOne.mockResolvedValue(mockUsers[0]);

      const createUserDto: CreateUserDto = {
        destination: 'user@gmail.com',
        role: mockRoles[2].code,
        permissions: [],
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if role code is invalid', async () => {
      //mock findRoleByCode method to throw BadRequestException for an invalid role code
      mockRoleRepository.findOne.mockImplementation((criteria) => {
        throw new BadRequestException(
          `Role with code ${criteria.where.code} not found`,
        );
      });
      mockUserRepository.findOne.mockImplementationOnce((email) => {
        const foundUser = mockUsers.find(
          (user) => user.email === email.where.email,
        );
        if (!foundUser) {
          return null;
        }
        return foundUser;
      });

      const createUserDto: CreateUserDto = {
        destination: 'user@gmail.com',
        role: 'testRole', //invalid role code
        permissions: [],
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if permission name is invalid', async () => {
      //mock getUserPermissions method to throw BadRequestException for an invalid permission name
      mockPermRepository.findOne.mockRejectedValue(
        new BadRequestException(
          'Permission with name testPermission not found',
        ),
      );
      mockUserRepository.findOne.mockImplementationOnce((email) => {
        const foundUser = mockUsers.find(
          (user) => user.email === email.where.email,
        );
        if (!foundUser) {
          return null;
        }
        return foundUser;
      });

      const createUserDto: CreateUserDto = {
        destination: 'user@gmail.com',
        role: mockRoles[2].code,
        permissions: ['testPermission'], //invalid permission name
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Find user by email', () => {
    it('should find a user by email', async () => {
      mockUserRepository.findOne.mockImplementationOnce((email) => {
        const foundUser = mockUsers.find(
          (user) => user.email === email.where.email,
        );
        if (!foundUser) {
          return null;
        }
        return foundUser;
      });
      const mockEmail: string = 'sofija@gmail.com';

      const user = await service.findByEmail(mockEmail);

      expect(user.email).toEqual(mockUsers[1].email);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockEmail },
      });
    });

    it('should not find a user by email - wrong email', async () => {
      const mockEmail: string = 'wrongEmail';

      mockUserRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findByEmail(mockEmail)).rejects.toThrow(
        new NotFoundException(`User with email address ${mockEmail} not found`),
      );
    });
  });

  describe('Find user by id', () => {
    it('should find a user by id', async () => {
      mockUserRepository.findOne.mockImplementationOnce((id) => {
        const foundUser = mockUsers.find((user) => user.id === id.where.id);
        if (!foundUser) {
          return null;
        }
        return foundUser;
      });
      const mockId: string = 'mockedId2';

      const user = await service.findById(mockId);

      expect(user.id).toEqual(mockUsers[1].id);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
    });

    it('should not find a user by id - wrong id', async () => {
      const mockId: string = 'wrongId';

      mockUserRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findById(mockId)).rejects.toThrow(
        new NotFoundException(`User with id ${mockId} not found`),
      );
    });
  });
  //TODO This is a bad description - why would user service test know the api where it has been referenced on the upper layers?
  describe('Fetch all roles GET /api/users/roles', () => {
    it('should return all roles', async () => {
      const roles = await service.getAllRoles();
      for (const value of roles) {
        expect(value).toMatchObject({
          id: value.id,
          code: value.code,
          users: value.users,
          permissions: value.permissions,
          createdAt: value.createdAt,
          updatedAt: value.updatedAt,
        });
      }
    });
    it('should return an empty list all roles', async () => {
      mockRoles = [];
      const result = await service.getAllRoles();
      expect(result.length).toBe(0);
    });
  });

  describe('Update user status', () => {
    it('should update the status of a user', async () => {
      const mockUserId: string = 'mockedId';
      const newUserStatus: UserStatusEnum = UserStatusEnum.INACTIVE;

      const updatedUser = await service.updateUserStatus(
        mockUserId,
        newUserStatus,
      );

      expect(updatedUser.status).toBe(newUserStatus);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException for invalid user ID', async () => {
      const invalidUserId: string = 'invalidId';
      const newUserStatus: UserStatusEnum = UserStatusEnum.INACTIVE;

      mockUserRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.updateUserStatus(invalidUserId, newUserStatus),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('Remove profile photo', () => {
    it('should remove profile photo of a user', async () => {
      const mockUserId: string = 'mockedId';

      const removedUser = await service.removeProfilePhoto(mockUserId);

      expect(removedUser.profilePhotoUrl).toBeNull();
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockUsers[0],
          profilePhotoUrl: null,
        }),
      );
    });

    it('should throw NotFoundException for invalid user ID', async () => {
      const invalidUserId: string = 'invalidId';

      mockUserRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.removeProfilePhoto(invalidUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Update user', () => {
    it('should update user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'John Doe',
        description: 'Updated description',
        hotAddress: 'updated_hot_address',
      };
      const id: string = 'mockedId';
      // Executing the update function
      const result = await service.update(id, updateUserDto);
      // Verifying the result
      expect(result.name).toBe(updateUserDto.name);
      expect(result.description).toBe(updateUserDto.description);
      expect(result.hotAddresses).toContain(updateUserDto.hotAddress);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'John Doe',
        description: 'Updated description',
        hotAddress: 'updated_hot_address',
      };
      const id = 'mock_Id';

      // Mocking findOne function to return undefined
      mockUserRepository.findOne.mockResolvedValue(undefined);

      // Executing the update function and expecting it to throw NotFoundException
      await expect(service.update(id, updateUserDto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if save operation fails', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'John Doe',
        description: 'Updated description',
        hotAddress: 'updated_hot_address',
      };
      const id = 'mocked_id';

      // Executing the update function and expecting it to throw InternalServerErrorException
      await expect(service.update(id, updateUserDto)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('Update users profile photo', () => {
    it('should update user profile photo', async () => {
      const fileUrl = 'photo-url';
      const mockUser = mockUsers[0];
      // mock private function mockFindEntityByIdWithAddresses
      const mockFindEntityByIdWithAddresses = jest
        .spyOn<any, any>(service, 'findEntityByIdWithAddresses')
        .mockResolvedValueOnce(mockUser);
      const result = await service.updateProfilePhoto(fileUrl, mockUser.id);
      expect(mockFindEntityByIdWithAddresses).toHaveBeenCalledWith(mockUser.id);
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result.profilePhotoUrl).toEqual(fileUrl);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockUser,
          profilePhotoUrl: fileUrl,
        }),
      );
    });

    it(`should throw NotFoundException if user not found`, async () => {
      const id = 'notExistingId';
      const fileUrl = 'photo-url';

      // Mocking findOne function to return undefined
      mockUserRepository.findOne.mockResolvedValueOnce(undefined);

      // Executing the update function and expecting it to throw NotFoundException
      await expect(
        service.updateProfilePhoto(fileUrl, id),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('Search users', () => {
    it('should return an array of CC Members', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        search: 'John',
        path: 'randomPath',
      };

      const userPaginatedDto: PaginatedDto<UserDto> = await service.searchUsers(
        query,
        false,
      );

      expect(userPaginatedDto.items[0].name).toEqual(user.name);
      expect(userPaginatedDto.items.length).toEqual(1);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });

    it('should return an empty array of users', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        search: 'NotExistingUser',
        path: 'randomPath',
      };

      mockPaginator.paginate.mockResolvedValueOnce(paginatedEmptyValue);

      const usersPaginatedDto: PaginatedDto<UserDto> =
        await service.searchUsers(query, false);
      expect(usersPaginatedDto.items).toEqual([]);
      expect(usersPaginatedDto.items.length).toEqual(0);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });

    it('should return an array with users and admins', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        path: 'randomPath',
      };

      mockPaginator.paginate.mockResolvedValueOnce(paginatedMultiValue);

      const usersPaginatedDto: PaginatedDto<UserDto> =
        await service.searchUsers(query, true);

      expect(usersPaginatedDto.items[0].name).toEqual(mockUsers[0].name);
      expect(usersPaginatedDto.items[1].name).toEqual(mockUsers[1].name);
      expect(usersPaginatedDto.items.length).toEqual(2);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });
  });

  describe(`Soft delete users`, () => {
    it(`should delete a user by id`, async () => {
      const mockUser = mockUsers[0];
      const mockFindEntityById = jest
        .spyOn<any, any>(service, 'findEntityById')
        .mockResolvedValueOnce(mockUser);
      const deletedUser = await service.softDelete(mockUser.id);
      expect(deletedUser.isDeleted).toEqual(true);
      expect(mockFindEntityById).toHaveBeenCalledWith(mockUser.id);
    });
    it(`shouldn't delete a user - already deleted`, async () => {
      const mockUser = mockUsers[0];
      mockUser.isDeleted = true;
      jest
        .spyOn<any, any>(service, 'findEntityById')
        .mockResolvedValueOnce(mockUser);
      try {
        await service.softDelete(mockUser.id);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.status).toEqual(409);
        expect(error.message).toEqual(`User already deleted`);
      }
    });
    it(`shouldn't delete a user - user not found`, async () => {
      const userId = 'notExistingUser';
      const mockFindEntityById = jest.spyOn<any, any>(
        service,
        'findEntityById',
      );
      mockFindEntityById.mockImplementation(() => {
        throw new NotFoundException(`User with id ${userId} not found`);
      });
      try {
        await service.softDelete(userId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.status).toEqual(404);
        expect(error.message).toEqual(`User with id ${userId} not found`);
      }
    });
  });
});
