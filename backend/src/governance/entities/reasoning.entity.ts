import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('reasonings')
@Unique(['userId', 'govActionProposalId'])
export class Reasoning extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @Column({
    name: 'title',
    type: 'varchar',
  })
  title: string;

  @Column({
    name: 'content',
    type: 'varchar',
  })
  content: string;

  @Column({
    name: 'cid',
    type: 'varchar',
  })
  cid: string;

  @Column({
    name: 'blake2b',
    type: 'varchar',
  })
  blake2b: string;

  @Column({
    name: 'url',
    type: 'varchar',
  })
  url: string;

  @Column({
    name: 'json',
    type: 'jsonb',
  })
  json: string;

  @Column({
    name: 'gov_action_proposal_id',
    type: 'bigint',
  })
  govActionProposalId: string;
}
