import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('hot_addresses')
export class HotAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'address',
    type: 'varchar',
  })
  address: string;

  @ManyToOne(() => User, (user) => user.hotAddresses, {
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
