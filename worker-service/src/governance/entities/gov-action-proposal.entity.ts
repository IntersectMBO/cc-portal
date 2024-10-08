import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

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
    nullable: true,
  })
  title: string;

  @Column({
    name: 'abstract',
    type: 'varchar',
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

  constructor(govActionProposal: Partial<GovActionProposal>) {
    super();
    Object.assign(this, govActionProposal);
  }
}
