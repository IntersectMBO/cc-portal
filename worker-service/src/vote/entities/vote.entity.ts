import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('votes')
export class Vote {
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Timestamp;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Timestamp;

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
    type: 'varchar',
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
