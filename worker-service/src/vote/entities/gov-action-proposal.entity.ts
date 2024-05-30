import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Vote } from './vote.entity';
import { CommonEntity } from '../../common/entitites/common.entity';

@Entity('gov_action_proposal')
export class GovActionProposal extends CommonEntity {
  @PrimaryColumn({
    name: 'gov_action_proposal_id',
    type: 'bigint',
  })
  govActionProposalId: string;

  @Column({
    name: 'voting_anchor_id',
    type: 'bigint',
  })
  votingAnchorId: string;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  title: string;

  @Column({
    name: 'abstract',
    type: 'varchar',
    length: 2500,
    nullable: true,
  })
  abstract: string;

  @Column({
    name: 'gov_metadata_url',
    type: 'varchar',
  })
  govMetadataUrl: string;

  @OneToMany(() => Vote, (votes) => votes.govActionProposal)
  votes: Vote[];

  constructor(govActionProposal: Partial<GovActionProposal>) {
    super();
    Object.assign(this, govActionProposal);
  }
}
