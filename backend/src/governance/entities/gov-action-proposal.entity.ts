import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Vote } from './vote.entity';
import { Rationale } from './rationale.entity';

@Entity('gov_action_proposals')
export class GovActionProposal extends CommonEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'bigint',
  })
  id: string;

  @Column({ name: 'tx_hash', type: 'varchar' })
  txHash: string;

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

  @Column({
    name: 'status',
    type: 'varchar',
  })
  status: string;

  @Column({
    name: 'gov_action_type',
    type: 'varchar',
  })
  govActionType: string;

  @Column({
    name: 'end_time',
    type: 'timestamp',
    nullable: true,
  })
  endTime: Date;

  @Column({
    name: 'submit_time',
    type: 'timestamp',
  })
  submitTime: Date;

  @OneToMany(() => Vote, (vote) => vote.govActionProposal)
  votes: Vote[];

  @OneToMany(() => Rationale, (rationale) => rationale.govActionProposal)
  rationales: Rationale[];

  constructor(govActionProposal: Partial<GovActionProposal>) {
    super();
    Object.assign(this, govActionProposal);
  }
}
