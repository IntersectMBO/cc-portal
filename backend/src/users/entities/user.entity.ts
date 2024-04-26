import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { CommonEntity } from '../../common/entities/common.entity';
import { Permission } from './permission.entity';
import { HotAddress } from './hotaddress.entity';
import { UserStatusEnum } from '../enums/user-status.enum';

@Entity('users')
export class User extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 80,
    unique: true,
  })
  email: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  description: string;

  @Column({
    name: 'profile_photo_url',
    type: 'varchar',
    nullable: true,
  })
  profilePhotoUrl: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatusEnum,
    nullable: true,
  })
  status: UserStatusEnum;

  @OneToMany(() => HotAddress, (hotAddress) => hotAddress.user, {
    cascade: true,
  })
  hotAddresses: HotAddress[];

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToMany(() => Permission, (permission) => permission.users, {
    eager: true,
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'user_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
