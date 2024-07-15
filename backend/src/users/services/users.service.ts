import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserStatusEnum } from '../enums/user-status.enum';
import { EntityManager, In, Repository, SelectQueryBuilder } from 'typeorm';
import { Role } from '../entities/role.entity';
import { UserDto } from '../dto/user.dto';
import { UserMapper } from '../mapper/userMapper.mapper';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Permission } from '../entities/permission.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { RoleDto } from '../dto/role.dto';
import { RoleMapper } from '../mapper/roleMapper.mapper';
import { HotAddress } from '../entities/hotaddress.entity';
import { RoleEnum } from '../enums/role.enum';
import { PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from '../util/pagination/user-pagination.config';
import { PaginatedDto } from 'src/util/pagination/dto/paginated.dto';
import { PaginationEntityMapper } from 'src/util/pagination/mapper/pagination.mapper';
import { Paginator } from 'src/util/pagination/paginator';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(HotAddress)
    private readonly hotAddressRepository: Repository<HotAddress>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly paginator: Paginator,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const userData: Partial<User> = {
      email: createUserDto.destination,
    };
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.destination,
      },
    });
    if (existingUser) {
      throw new ConflictException(
        `User with email address ${existingUser.email} already exists`,
      );
    }

    const userRole = await this.findRoleByCode(createUserDto.role);
    const userPermissions = await this.getUserPermissions(
      createUserDto.permissions,
    );

    //Store user and related entities and return User Entity
    let returnedUser: User;
    try {
      returnedUser = await this.entityManager.transaction(() => {
        const user = this.userRepository.create(userData);
        user.role = userRole;
        user.status = UserStatusEnum.PENDING;
        user.permissions = userPermissions;

        return this.userRepository.save(user);
      });
    } catch (e) {
      this.logger.error(`Error within transaction: ${e.message}`);
      throw new InternalServerErrorException('Transaction failed');
    }

    return UserMapper.userToDto(returnedUser);
  }

  private async findRoleByCode(roleCode: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        code: roleCode,
      },
    });

    if (!role) {
      throw new BadRequestException(`Role with code ${roleCode} not found`);
    }

    return role;
  }

  private async getUserPermissions(
    permissionNames: string[],
  ): Promise<Permission[]> {
    const userPermissions: Permission[] = [];
    for (const permissionName of permissionNames) {
      const permission = await this.permissionRepository.findOne({
        where: {
          code: permissionName,
        },
      });

      if (!permission) {
        throw new BadRequestException(
          `Permission with name ${permissionName} not found`,
        );
      }

      userPermissions.push(permission);
    }
    return userPermissions;
  }

  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with email address ${email} not found`);
    }
    return UserMapper.userToDto(user);
  }

  async findMultipleByIds(ids: string[]): Promise<UserDto[]> {
    const users = await this.findMultipleEntitiesByIds(ids);
    return users.map((user) => {
      return UserMapper.userToDto(user);
    });
  }

  private async findMultipleEntitiesByIds(ids: string[]): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.findEntityById(id);
    return UserMapper.userToDto(user);
  }

  private async findEntityById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.findEntityByIdWithAddresses(id);

    user.name = updateUserDto.name;
    user.description = updateUserDto.description;

    if (updateUserDto.hotAddress) {
      await this.checkUniqueUserHotAddress(updateUserDto.hotAddress);

      const hotAddress = new HotAddress();
      hotAddress.address = updateUserDto.hotAddress;
      user.hotAddresses.push(hotAddress);
    }

    const updatedUser = await this.userRepository.save(user);
    return UserMapper.userToDto(updatedUser);
  }
  async updateProfilePhoto(fileUrl: string, id: string): Promise<UserDto> {
    const user = await this.findEntityByIdWithAddresses(id);
    user.profilePhotoUrl = fileUrl;

    const updatedUser = await this.userRepository.save(user);
    return UserMapper.userToDto(updatedUser);
  }

  private async findEntityByIdWithAddresses(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['hotAddresses'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  private async checkUniqueUserHotAddress(hotAddress: string) {
    const existingHotAddress = await this.hotAddressRepository.findOne({
      where: {
        address: hotAddress,
      },
    });

    if (existingHotAddress) {
      throw new ConflictException(`Address ${hotAddress} already assigned`);
    }
  }

  async updateUserStatus(
    id: string,
    userStatus: UserStatusEnum,
  ): Promise<UserDto> {
    const user = await this.findEntityById(id);
    user.status = userStatus;
    user.deactivatedAt =
      userStatus === UserStatusEnum.INACTIVE ? new Date() : null;
    await this.userRepository.save(user);
    return UserMapper.userToDto(user);
  }

  async removeProfilePhoto(id: string): Promise<UserDto> {
    const user = await this.findEntityById(id);
    user.profilePhotoUrl = null;
    await this.userRepository.save(user);
    return UserMapper.userToDto(user);
  }

  async getAllRoles(): Promise<RoleDto[]> {
    const roles = await this.roleRepository.find();
    const results: RoleDto[] = roles.map((role) => RoleMapper.roleToDto(role));
    return results;
  }

  async searchUsers(
    query: PaginateQuery,
    isAdmin: boolean,
  ): Promise<PaginatedDto<UserDto>> {
    const customQuery = isAdmin
      ? this.returnAdminSearchQuery()
      : this.returnUserSearchQuery();

    const result = await this.paginator.paginate(
      query,
      customQuery,
      USER_PAGINATION_CONFIG,
    );

    return new PaginationEntityMapper<User, UserDto>().paginatedToDto(
      result,
      UserMapper.userToDto,
    );
  }

  private returnAdminSearchQuery(): SelectQueryBuilder<User> {
    return this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.role', 'role')
      .where('role.code != :code', { code: RoleEnum.SUPER_ADMIN });
  }

  private returnUserSearchQuery(): SelectQueryBuilder<User> {
    return this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.role', 'role')
      .where('role.code = :code', { code: RoleEnum.USER })
      .andWhere('users.status = :status', { status: UserStatusEnum.ACTIVE });
  }
}
