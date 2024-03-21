import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./role.entity";
import { CommonEntity } from "../../common/entities/common.entity";

@Entity("users")
export class User extends CommonEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "name",
    type: "varchar",
    length: 50,
    nullable: true,
  })
  name: string;

  @Column({
    name: "email",
    type: "varchar",
    length: 80,
    unique: true,
  })
  email: string;

  @Column({
    name: "hot_adress",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  hotAddress: string;

  @Column({
    name: "description",
    type: "varchar",
    length: 500,
    nullable: true,
  })
  description: string;

  @Column({
    name: "profile_photo",
    type: "varchar",
    nullable: true,
  })
  profilePhoto: string; //path to the profile photo

  @ManyToMany(() => Role, (role) => role.users, {
    eager: true,
  })
  @JoinTable({
    name: "user_roles",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
  })
  roles: Role[];

  @Column({
    name: "whitelisted",
    default: false,
  })
  whitelisted: boolean;

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
