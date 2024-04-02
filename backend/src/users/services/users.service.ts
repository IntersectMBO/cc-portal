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
import { EntityManager, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { UserDto } from '../dto/user.dto';
import { UserMapper } from '../mapper/userMapper.mapper';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Permission } from '../entities/permission.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { S3Service } from '../../s3/s3.service';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepoository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private s3Service: S3Service,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const userData: Partial<User> = {
      email: createUserDto.email,
    };
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      throw new ConflictException(
        `User with email address ${existingUser.email} already exists`,
      );
    }

    const userRoles: Role[] = [];
    for (const roleCode of createUserDto.roles) {
      const role = await this.roleRepoository.findOne({
        where: {
          code: roleCode,
        },
      });

      if (!role) {
        throw new BadRequestException(`Role with code ${roleCode} not found`);
      }

      userRoles.push(role);
    }

    const userPermissions: Permission[] = [];
    for (const permissionCode of createUserDto.permissions) {
      const permission = await this.permissionRepository.findOne({
        where: {
          code: permissionCode,
        },
      });

      if (!permission) {
        throw new BadRequestException(
          `Permission with code ${permissionCode} not found`,
        );
      }

      userPermissions.push(permission);
    }

    let returnedUser: User;
    try {
      returnedUser = await this.entityManager.transaction(() => {
        const user = this.userRepository.create(userData);
        user.roles = userRoles;
        return this.userRepository.save(user);
      });
    } catch (e) {
      this.logger.error(`Error within transaction: ${e.message}`);
      throw new InternalServerErrorException('Transaction failed');
    }

    return UserMapper.userToDto(returnedUser);
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

  async update(
    file: Express.Multer.File,
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }
    user.name = updateUserDto.name;
    user.description = updateUserDto.description;
    user.hotAddress = updateUserDto.hotAddress;
    // const bucketKey = `${file.fieldname}${Date.now()}`;
    await this.s3Service.createBucketIfNotExists();
    const fileName = await this.s3Service.uploadFileMinio(file);
    user.profilePhoto = await this.s3Service.getFileUrl(fileName);
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
}
