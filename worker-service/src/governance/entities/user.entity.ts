import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { HotAddress } from './hotaddress.entity';

@Entity('users')
export class User extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => HotAddress, (hotAddress) => hotAddress.user)
  hotAddresses: HotAddress[];
}
