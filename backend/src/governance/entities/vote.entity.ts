import { CommonEntity } from '../../common/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GovActionProposal } from './gov-action-proposal.entity';

@Entity('votes')
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

  @ManyToOne(
    () => GovActionProposal,
    (govActionProposal) => govActionProposal.govActionProposalId,
  )
  @JoinColumn({ name: 'gov_action_proposal_id' })
  govActionProposal: GovActionProposal;

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
    name: 'gov_action_type',
    type: 'varchar',
  })
  govActionType: string;

  @Column({
    name: 'end_time',
    type: 'timestamp',
  })
  endTime: Date;

  @Column({
    name: 'submit_time',
    type: 'timestamp',
  })
  submitTime: Date;
}
