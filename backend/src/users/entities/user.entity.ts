import {
  Column,
  Entity,
  Index,
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
import { Rationale } from '../../governance/entities/rationale.entity';
import { Vote } from '../../governance/entities/vote.entity';

@Entity('users')
export class User extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 64,
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

  @Index('users_status_idx')
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

  @OneToMany(() => Rationale, (rationale) => rationale.user, {
    cascade: true,
  })
  rationales: Rationale[];

  @OneToMany(() => Vote, (vote) => vote.user, {
    cascade: true,
  })
  votes: Vote[];

  @Index('users_role_id_idx')
  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToMany(() => Permission, (permission) => permission.users, {
    eager: true,
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

  @Column({
    name: 'deactivated_at',
    type: 'timestamp',
    nullable: true,
  })
  deactivatedAt: Date;

  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
