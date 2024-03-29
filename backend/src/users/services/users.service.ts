import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User, UserStatusEnum } from '../entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { UserDto } from '../dto/user.dto';
import { UserMapper } from '../mapper/userMapper.mapper';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Permission } from '../entities/permission.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { RoleDto } from '../dto/role.dto';
import { RoleMapper } from '../mapper/roleMapper.mapper';

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
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
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

    const userRoles = await this.getUserRoles(createUserDto.roles);
    const userPermissions = await this.getUserPermissions(
      createUserDto.permissions,
    );

    //Store user and related entities and return User Entity
    let returnedUser: User;
    try {
      returnedUser = await this.entityManager.transaction(() => {
        const user = this.userRepository.create(userData);
        user.roles = userRoles;
        user.permissions = userPermissions;

        return this.userRepository.save(user);
      });
    } catch (e) {
      this.logger.error(`Error within transaction: ${e.message}`);
      throw new InternalServerErrorException('Transaction failed');
    }

    return UserMapper.userToDto(returnedUser);
  }

  private async getUserRoles(roleCodes: string[]): Promise<Role[]> {
    const userRoles: Role[] = [];
    for (const roleCode of roleCodes) {
      const role = await this.roleRepository.findOne({
        where: {
          code: roleCode,
        },
      });

      if (!role) {
        throw new BadRequestException(`Role with code ${roleCode} not found`);
      }

      userRoles.push(role);
    }
    return userRoles;
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

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    const results: UserDto[] = users.map((x) => UserMapper.userToDto(x));

    return results;
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserMapper.userToDto(user);
  }

  private async findById(id: string): Promise<User> {
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
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }
    user.name = updateUserDto.name;

    let updatedUser: User;
    try {
      updatedUser = await this.entityManager.transaction(() => {
        const userData = this.userRepository.create(user);
        return this.userRepository.save(userData);
      });
    } catch (e) {
      this.logger.error(`error when updating the user  : ${e.message}`);
      throw new InternalServerErrorException('update user failed');
    }

    return UserMapper.userToDto(updatedUser);
  }

  async toggleWhitelist(id: string, whitelisted: boolean): Promise<UserDto> {
    const user = await this.findById(id);
    user.whitelisted = whitelisted;
    await this.userRepository.save(user);

    return UserMapper.userToDto(user);
  }

  async updateUserStatus(
    id: string,
    userStatus: UserStatusEnum,
  ): Promise<UserDto> {
    const user = await this.findById(id);
    user.status = userStatus;
    await this.userRepository.save(user);
    return UserMapper.userToDto(user);
  }

  async getAllRoles(): Promise<RoleDto[]> {
    const roles = await this.roleRepository.find();
    const results: RoleDto[] = roles.map((role) => RoleMapper.roleToDto(role));
    return results;
  }
}
