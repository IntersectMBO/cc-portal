import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { CommonEntity } from '../../common/entities/common.entity';

export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('roles')
export class Role extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'code',
    type: 'enum',
    enum: RoleEnum,
  })
  code: string;

  @ManyToMany(() => User, (user) => user.roles, {
    onDelete: 'CASCADE',
  })
  users: User[];

  constructor(role: Partial<Role>) {
    super();
    Object.assign(this, role);
  }
}
