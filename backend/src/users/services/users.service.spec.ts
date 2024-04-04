import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserStatusEnum } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '../../s3/s3.service';
import { Permission } from '../entities/permission.entity';
import { UserDto } from '../dto/user.dto';
import { HotAddress } from '../entities/hotaddress.entity';
const mockS3Service = {
  uploadFileMinio: jest.fn().mockResolvedValue('mocked_file_name'),
  createBucketIfNotExists: jest.fn().mockResolvedValue('new_bucket'),
  getFileUrl: jest.fn().mockResolvedValue('mocked_file_url'),
};
const mockUser: UserDto = {
  id: 'mockedId',
  name: 'John Doe',
  email: 'mockedEmail',
  hotAddresses: ['mockedHotAddress', 'aasjjsjsus'],
  description: 'mockedDescription',
  profilePhoto: 'mockedProfilePhoto',
  status: UserStatusEnum.ACTIVE,
  role: 'role1',
  permissions: ['permission1', 'permission2'],
  createdAt: null,
  updatedAt: null,
};

const mockUserRepository = {
  create: jest.fn().mockImplementation((user) => {
    return user;
  }),
  save: jest.fn().mockImplementation((user) => {
    return user;
  }),
  findOne: jest.fn().mockImplementation((id) => {
    if (id.where.id !== mockUser.id) {
      return new NotFoundException('user not found');
    }
    return mockUser;
  }),
};
const mockRoleRepository = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockResolvedValue({}),
  findOne: jest.fn().mockResolvedValue({}),
};
const mockPermRepository = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockResolvedValue({}),
  findOne: jest.fn().mockResolvedValue({}),
};
const mockHotAddressRepository = {
  create: jest.fn().mockImplementation((hotAdd: string[]) => {
    return hotAdd;
  }),
  save: jest.fn().mockImplementation((hotAdd: string[]) => {
    return hotAdd;
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
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: S3Service, useValue: mockS3Service },
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
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update user successfully', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'John Doe',
      description: 'Updated description',
      hotAddresses: ['updated_hot_address', 'updated_2'],
    };
    const mockFile: any = { fieldname: 'profilePhoto' };
    const id: string = 'mockedId';
    // Executing the update function
    const result = await service.update(mockFile, id, updateUserDto);
    // Verifying the result
    expect(result.name).toBe(updateUserDto.name);
    expect(result.description).toBe(updateUserDto.description);
    expect(result.hotAddresses).toEqual(updateUserDto.hotAddresses);
    expect(result.profilePhoto).toBe('mocked_file_url');
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if user not found', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'John Doe',
      description: 'Updated description',
      hotAddresses: ['updated_hot_address', 'updated_2'],
    };
    const mockFile: any = { fieldname: 'profilePhoto' };
    const id = 'mock_Id';

    // Mocking findOne function to return undefined
    mockUserRepository.findOne.mockResolvedValue(undefined);

    // Executing the update function and expecting it to throw NotFoundException
    await expect(
      service.update(mockFile, id, updateUserDto),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should throw NotFoundException if save operation fails', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'John Doe',
      description: 'Updated description',
      hotAddresses: ['updated_hot_address', 'updated_2'],
    };
    const mockFile: any = { fieldname: 'profilePhoto' };
    const id = 'mocked_id';

    // Mocking save operation to throw an error
    mockUserRepository.save.mockRejectedValue(
      new Error('Save operation failed'),
    );

    // Executing the update function and expecting it to throw InternalServerErrorException
    await expect(
      service.update(mockFile, id, updateUserDto),
    ).rejects.toThrowError(NotFoundException);
  });
});
