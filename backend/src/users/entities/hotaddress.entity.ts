import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('hot_addresses')
export class HotAddress extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'address',
    type: 'varchar',
    nullable: true,
  })
  address: string;

  @ManyToOne(() => User, (user) => user.hotAddresses)
  user: User;
}
