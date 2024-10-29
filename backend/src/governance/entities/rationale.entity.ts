import { CommonEntity } from '../../common/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { GovActionProposal } from './gov-action-proposal.entity';
import { User } from '../../users/entities/user.entity';

@Entity('rationales')
@Unique(['userId', 'govActionProposalId'])
export class Rationale extends CommonEntity {
  @ManyToOne(() => User, (user) => user.rationales, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @PrimaryColumn({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @ManyToOne(
    () => GovActionProposal,
    (govActionProposal) => govActionProposal.id,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'gov_action_proposal_id' })
  govActionProposal: GovActionProposal;

  @PrimaryColumn({
    name: 'gov_action_proposal_id',
    type: 'bigint',
  })
  govActionProposalId: string;

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
}
