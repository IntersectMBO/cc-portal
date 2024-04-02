import { Module } from "@nestjs/common";
import { UsersService } from "./services/users.service";
import { UsersController } from "./api/users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Role } from "./entities/role.entity";
import { UsersFacade } from "./facade/users.facade";
import { Permission } from "./entities/permission.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  controllers: [UsersController],
  providers: [UsersFacade, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
