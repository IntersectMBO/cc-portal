import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CommonEntity } from '../../common/entities/common.entity';
import { Permission } from './permission.entity';
import { RoleEnum } from '../enums/role.enum';

@Entity('roles')
export class Role extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('roles_code_idx')
  @Column({
    name: 'code',
    type: 'enum',
    enum: RoleEnum,
  })
  code: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    eager: true,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  constructor(role: Partial<Role>) {
    super();
    Object.assign(this, role);
  }
}
