import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  Unique,
} from 'typeorm';
import { CommonEntity } from '../../common/entitites/common.entity';

@Entity('votes')
@Unique('UQ_comment', ['comment'])
export class Vote extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @Column({
    name: 'hot_address',
    type: 'varchar',
  })
  hotAddress: string;

  @Column({
    name: 'gov_action_proposal_id',
    type: 'bigint',
  })
  govActionProposalId: string;

  @Column({
    name: 'vote',
    type: 'varchar',
  })
  vote: string;

  @Column({
    name: 'title',
    type: 'varchar',
    nullable: true,
  })
  title: string;

  @Column({
    name: 'comment',
    type: 'varchar',
    nullable: true,
  })
  comment: string;

  @Column({
    name: 'type',
    type: 'varchar',
  })
  type: string;

  @Column({
    name: 'gov_metadata_url',
    type: 'varchar',
  })
  govMetadataUrl: string;

  @Column({
    name: 'end_time',
    type: 'timestamp',
  })
  endTime: Timestamp;

  @Column({
    name: 'time',
    type: 'timestamp',
  })
  time: Timestamp;
}
