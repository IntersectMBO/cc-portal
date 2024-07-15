import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './api/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UsersFacade } from './facade/users.facade';
import { Permission } from './entities/permission.entity';
import { HotAddress } from './entities/hotaddress.entity';
import { S3Module } from 'src/s3/s3.module';
import { RoleController } from './api/role.controller';
import { Paginator } from 'src/util/pagination/paginator';
import { RoleFactory } from './role/role.factory';
import { AdminRole } from './role/role.impl';
import { SuperAdminRole } from './role/role.impl';
import { UserRole } from './role/role.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, HotAddress]),
    S3Module,
  ],
  controllers: [UsersController, RoleController],
  providers: [
    UsersFacade,
    UsersService,
    Paginator,
    RoleFactory,
    SuperAdminRole,
    AdminRole,
    UserRole,
  ],
  exports: [UsersService],
})
export class UsersModule {}
