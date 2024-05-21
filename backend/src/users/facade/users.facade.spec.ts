import { Test, TestingModule } from '@nestjs/testing';
import { UsersFacade } from './users.facade';
import { UsersService } from '../services/users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserStatusEnum } from '../enums/user-status.enum';
import { UserDto } from '../dto/user.dto';
import { Permission } from '../entities/permission.entity';
import { S3Service } from '../../s3/service/s3.service';
import { RoleDto } from '../dto/role.dto';
import { Role } from '../entities/role.entity';
import { SearchQueryDto } from '../dto/search-query.dto';
import { UpdateUserRequest } from '../api/request/update-user.request';
import { UserResponse } from '../api/response/user.response';
import { SortOrder } from 'src/util/pagination/enums/sort-order.enum';
import { UsersPaginatedDto } from '../dto/users-paginated.dto';
import { PaginationResponse } from '../../util/pagination/response/pagination.response';
import { UserMapper } from '../mapper/userMapper.mapper';

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

  const mockUsers2: UserDto[] = [
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
    {
      id: '3',
      name: 'Zoran Ivanovic',
      email: 'zoran@example.com',
      description: 'Lorem ipsum dolor sit amet 3',
      profilePhotoUrl: 'https://example3.com/profile.jpg',
      status: UserStatusEnum.ACTIVE,
      hotAddresses: ['zoran1', 'zoran2'],
      role: mockRoles[2].code,
      permissions: [],
      createdAt: null,
      updatedAt: null,
    },
  ];

  const mockFile = {
    fieldname: 'file',
    originalname: 'profile.jpeg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('one,two,three'),
  } as Express.Multer.File;

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
    update: jest.fn(),
    updateProfilePhoto: jest.fn(),
    removeProfilePhoto: jest.fn(),
    searchUsers: jest
      .fn()
      .mockImplementation((searchQuery: SearchQueryDto, isAdmin: boolean) => {
        const { searchPhrase, pageOptions } = searchQuery;
        const { order, skip, perPage } = pageOptions;

        const userResponse = mockUsers2.map((userDto: UserDto) =>
          UserMapper.mapUserDtoToResponse(userDto),
        );
        let filteredUsers = userResponse;

        if (searchPhrase) {
          filteredUsers = filteredUsers.filter((user) =>
            user.name.toLowerCase().includes(searchPhrase.toLowerCase()),
          );
        }

        if (isAdmin) {
          filteredUsers = filteredUsers.filter(
            (user) => user.role !== 'super_admin',
          );
        } else {
          filteredUsers = filteredUsers.filter(
            (user) =>
              user.role === 'user' && user.status === UserStatusEnum.ACTIVE,
          );
        }

        const sortedUsers = filteredUsers.sort((a, b) => {
          if (order === SortOrder.ASC) {
            return a.name > b.name ? 1 : -1;
          } else if (order === SortOrder.DESC) {
            return b.name > a.name ? -1 : -1;
          }
        });

        const paginatedUsers = sortedUsers.slice(skip, skip + perPage);

        const usersPaginatedDto: UsersPaginatedDto = {
          userDtos: paginatedUsers,
          itemCount: sortedUsers.length,
        };

        return usersPaginatedDto;
      }),
  };

  const mockS3Service = {
    deleteFile: jest.fn(),
  };

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

  describe(`Update user`, () => {
    it(`should return updated user`, async () => {
      const userId = mockUsers[1].id;
      const updateUserRequest = {
        name: 'updatedName',
      } as UpdateUserRequest;
      const expectedUserDto: UserDto = {
        ...mockUsers[1],
        ...updateUserRequest,
      };
      const expectedUserResponse: UserResponse = { ...expectedUserDto };

      mockUserService.update.mockResolvedValueOnce(expectedUserDto);

      const result = await facade.update(userId, updateUserRequest);

      expect(mockUserService.update).toHaveBeenCalledWith(
        userId,
        updateUserRequest,
      );
      expect(result).toEqual(expectedUserResponse);
    });

    it('should handle errors from the UsersService', async () => {
      const userId = 'notExistingUserId';
      const updateUserRequest = {
        name: 'updatedName',
      } as UpdateUserRequest;

      mockUserService.update.mockRejectedValueOnce(new NotFoundException());

      await expect(facade.update(userId, updateUserRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(`Update user's profile photo`, () => {
    it('should update profile photo', async () => {
      const userId = mockUsers[1].id;

      // mock private function mockFindEntityByIdWithAddresses
      jest
        .spyOn<any, string>(facade, 'storeProfilePhotoIfExists')
        .mockResolvedValueOnce('profile.jpeg');

      const expectedUserDto: UserDto = {
        ...mockUsers[1],
      };
      expectedUserDto.profilePhotoUrl = mockFile.originalname;
      const expectedUserResponse: UserResponse = expectedUserDto;

      mockUserService.updateProfilePhoto.mockResolvedValueOnce(expectedUserDto);

      const result = await facade.updateProfilePhoto(mockFile, userId);

      expect(result).toEqual(expectedUserResponse);
      expect(mockUserService.updateProfilePhoto).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'notExistingUserId';
      // mock private function mockFindEntityByIdWithAddresses
      jest
        .spyOn<any, string>(facade, 'storeProfilePhotoIfExists')
        .mockResolvedValueOnce('profile.jpeg');

      mockUserService.updateProfilePhoto.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(facade.updateProfilePhoto(mockFile, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Remove profile photo', () => {
    it('should remove profile photo', async () => {
      const user = mockUsers[1];
      user.profilePhotoUrl = 'profile.jpg';

      const expectedUserDto = {
        ...user,
        ...{ profilePhotoUrl: null },
      };

      mockUserService.removeProfilePhoto.mockResolvedValueOnce(expectedUserDto);
      const expectedUserResponse: UserResponse = { ...expectedUserDto };

      const result = await facade.deleteProfilePhoto(user.id);

      expect(result).toEqual(expectedUserResponse);
      expect(result.profilePhotoUrl).toBeNull();
      expect(mockUserService.removeProfilePhoto).toHaveBeenCalledWith(user.id);
    });

    it('should throw ConflictException', async () => {
      const user = mockUsers[1];
      user.profilePhotoUrl = null;
      try {
        await facade.deleteProfilePhoto(user.id);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.status).toEqual(409);
        expect(error.message).toEqual('user does not have profile photo');
      }
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'notExistingUserId';
      mockUserService.findById.mockRejectedValueOnce(new NotFoundException());

      await expect(facade.deleteProfilePhoto(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Search users', () => {
    it('should return an array of CC Members', async () => {
      const searchQuery = new SearchQueryDto('ivan', 1, 10, SortOrder.DESC);

      const foundUser = await facade.searchUsers(searchQuery, false);
      const userResponse = mockUsers2.map((user) =>
        UserMapper.mapUserDtoToResponse(user),
      );
      const expectedResponse: PaginationResponse<UserResponse> = {
        data: [userResponse[2], userResponse[1]],
        meta: {
          page: 1,
          perPage: 10,
          pageCount: 1,
          itemCount: 2,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };

      expect(foundUser).toEqual(expectedResponse);
      expect(mockUserService.searchUsers).toHaveBeenCalledWith(
        searchQuery,
        false,
      );
    });

    it('should return an array of Admins and CC Members', async () => {
      const searchQuery = new SearchQueryDto('', 1, 10, SortOrder.ASC);

      const foundUser = await facade.searchUsers(searchQuery, true);
      const userResponse = mockUsers2.map((user) =>
        UserMapper.mapUserDtoToResponse(user),
      );
      const expectedResponse: PaginationResponse<UserResponse> = {
        data: [userResponse[1], userResponse[0], userResponse[2]],
        meta: {
          page: 1,
          perPage: 10,
          pageCount: 1,
          itemCount: 3,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };

      expect(foundUser).toEqual(expectedResponse);
      expect(mockUserService.searchUsers).toHaveBeenCalledWith(
        searchQuery,
        true,
      );
    });

    it('should return an array of administrators and CC members from the second page', async () => {
      const searchQuery = new SearchQueryDto('', 2, 2, SortOrder.DESC);

      const foundUser = await facade.searchUsers(searchQuery, true);
      const userResponse = mockUsers2.map((user) =>
        UserMapper.mapUserDtoToResponse(user),
      );
      const expectedResponse: PaginationResponse<UserResponse> = {
        data: [userResponse[0]],
        meta: {
          page: 2,
          perPage: 2,
          pageCount: 2,
          itemCount: 3,
          hasPreviousPage: true,
          hasNextPage: false,
        },
      };

      expect(foundUser).toEqual(expectedResponse);
      expect(mockUserService.searchUsers).toHaveBeenCalledWith(
        searchQuery,
        true,
      );
    });

    it('should return an empty array if no name with given phrase', async () => {
      const searchQuery: SearchQueryDto = new SearchQueryDto(
        'not existing user',
        1,
        10,
        SortOrder.DESC,
      );
      const expectedResult: PaginationResponse<UserResponse> = {
        data: [],
        meta: {
          page: 1,
          perPage: 10,
          pageCount: 0,
          itemCount: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };
      const foundUser = await facade.searchUsers(searchQuery, true);
      expect(foundUser).toEqual(expectedResult);
      expect(mockUserService.searchUsers).toHaveBeenCalledWith(
        searchQuery,
        true,
      );
    });
  });
});
