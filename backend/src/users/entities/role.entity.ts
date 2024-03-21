import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { CommonEntity } from "../../common/entities/common.entity";
import { Permission } from "./permission.entity";

export enum RoleEnum {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  USER = "user",
}

@Entity("roles")
export class Role extends CommonEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "code",
    type: "enum",
    enum: RoleEnum,
  })
  code: string;

  @ManyToMany(() => User, (user) => user.roles, {
    onDelete: "CASCADE",
  })
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    eager: true,
  })
  @JoinTable({
    name: "role_permissions",
    joinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "permission_id",
      referencedColumnName: "id",
    },
  })
  permissions: Permission[];

  constructor(role: Partial<Role>) {
    super();
    Object.assign(this, role);
  }
}
