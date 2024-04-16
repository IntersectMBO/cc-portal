import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ipfs')
export class Ipfs extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'cid',
    type: 'varchar',
  })
  cid: string;

  @Column({
    name: 'content_type',
    type: 'varchar',
  })
  contentType: string;

  @Column({
    name: 'content',
    type: 'text',
  })
  content: string;

  @Column({
    name: 'version',
    type: 'varchar',
  })
  version: string;
}
