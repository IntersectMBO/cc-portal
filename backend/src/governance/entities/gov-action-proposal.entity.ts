import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Vote } from './vote.entity';

@Entity('gov_action_proposals')
export class GovActionProposal extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => Vote, (votes) => votes.govActionProposal, {
    cascade: true,
  })
  votes: Vote[];
}
