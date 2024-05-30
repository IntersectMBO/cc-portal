import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HotAddress } from './hotaddress.entity';
import { CommonEntity } from '../../common/entitites/common.entity';

@Entity('users')
export class User extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => HotAddress, (hotAddress) => hotAddress.user)
  hotAddresses: HotAddress[];
}
