import { CommonEntity } from '../../common/entities/common.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { GovActionProposal } from './gov-action-proposal.entity';
import { User } from '../../users/entities/user.entity';

@Entity('votes')
export class Vote extends CommonEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'bigint',
  })
  id: string;

  @Index('votes_user_id_idx')
  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @ManyToOne(() => User, (user) => user.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'hot_address',
    type: 'varchar',
  })
  hotAddress: string;

  @Index('votes_gov_action_proposal_id_idx')
  @ManyToOne(
    () => GovActionProposal,
    (govActionProposal) => govActionProposal.id,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'gov_action_proposal_id' })
  govActionProposal: GovActionProposal;

  @Index('votes_vote_idx')
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
    name: 'vote_metadata_url',
    type: 'varchar',
    nullable: true,
  })
  voteMetadataUrl: string;

  @Column({
    name: 'submit_time',
    type: 'timestamp',
  })
  submitTime: Date;
}
