import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity('ipfs')
export class Ipfs extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cid', type: 'varchar' })
  cid: string;

  @Column({ name: 'content_type', type: 'varchar' })
  contentType: string;
}
