import { CommonEntity } from '../../common/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('hot_addresses')
export class HotAddress extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'address',
    type: 'varchar',
    unique: true,
  })
  address: string;

  @ManyToOne(() => User, (user) => user.hotAddresses)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
