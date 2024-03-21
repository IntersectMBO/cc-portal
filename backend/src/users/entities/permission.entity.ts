import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommonEntity } from "../../common/entities/common.entity";
import { Role } from "./role.entity";

export enum PermissionAdminEnum {
  MANAGE_CC_MEMBERS = "manage_cc_members",
  ADD_CONSTITUTION = "add_constitution_version",
  ADD_ADMIN = "add_new_admin",
}

@Entity("permissions")
export class Permission extends CommonEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "name",
    type: "enum",
    enum: PermissionAdminEnum,
  })
  name: string;

  @ManyToMany(() => Role, (role) => role.permissions, {
    onDelete: "CASCADE",
  })
  roles: Role[];
}
