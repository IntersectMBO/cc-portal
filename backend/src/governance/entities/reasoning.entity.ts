import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GovActionProposal } from './gov-action-proposal.entity';

@Entity('reasonings')
export class Reasoning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => GovActionProposal,
    (govActionProposal) => govActionProposal.txHash,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'gov_action_proposal_id' })
  govActionProposal: GovActionProposal;
}
