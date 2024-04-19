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
import { EntityManager, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { UserDto } from '../dto/user.dto';
import { UserMapper } from '../mapper/userMapper.mapper';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Permission } from '../entities/permission.entity';
import { CreateUserDto } from '../dto/create-user.dto';
// import { S3Service } from '../../s3/service/s3.service';
import { RoleDto } from '../dto/role.dto';
import { RoleMapper } from '../mapper/roleMapper.mapper';
import { HotAddress } from '../entities/hotaddress.entity';

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
    // private s3Service: S3Service,
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

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    const results: UserDto[] = users.map((x) => UserMapper.userToDto(x));

    return results;
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

  async update(
    fileUrl: string,
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.findEntityByIdWithAddresses(id);

    user.name = updateUserDto.name;
    user.description = updateUserDto.description;
    user.profilePhotoUrl = fileUrl;

    if (updateUserDto.hotAddress) {
      await this.checkUniqueUserHotAddress(
        user.hotAddresses,
        updateUserDto.hotAddress,
      );

      const hotAddress = new HotAddress();
      hotAddress.address = updateUserDto.hotAddress;
      user.hotAddresses.push(hotAddress);
    }

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

  private async checkUniqueUserHotAddress(
    existingAddresses: HotAddress[],
    hotAddress: string,
  ) {
    const includes = existingAddresses
      .map((x) => x.address)
      .includes(hotAddress);

    if (includes) {
      throw new ConflictException(`Address ${hotAddress} already assigned`);
    }
  }

  async updateUserStatus(
    id: string,
    userStatus: UserStatusEnum,
  ): Promise<UserDto> {
    const user = await this.findEntityById(id);
    user.status = userStatus;
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
}
