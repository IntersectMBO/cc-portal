import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { GovActionProposal } from './gov-action-proposal.entity';

@Entity('votes')
export class Vote extends CommonEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'bigint',
  })
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
    (govActionProposal) => govActionProposal.id,
    {
      cascade: true,
      eager: true,
    },
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
    name: 'submit_time',
    type: 'timestamp',
  })
  submitTime: Date;
}
