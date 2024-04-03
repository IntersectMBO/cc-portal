import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { Role } from './role.entity';
import { User } from './user.entity';
import { PermissionEnum } from '../enums/permission.enum';

@Entity('permissions')
export class Permission extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'code',
    type: 'enum',
    enum: PermissionEnum,
  })
  code: string;

  @ManyToMany(() => Role, (role) => role.permissions, {
    onDelete: 'CASCADE',
  })
  roles: Role[];

  @ManyToMany(() => User, (user) => user.permissions, {
    onDelete: 'CASCADE',
  })
  users: User[];
}
