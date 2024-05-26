import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '../../common/entitites/common.entity';

@Entity('governance_metadata')
export class GovernanceMetadata extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
}
