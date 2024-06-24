import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ReasoningRequest {
  @ApiProperty({
    description: 'Uniq ID of the Governanace Action Proposal',
    name: 'gov_action_proposal_id',
  })
  @IsNumber()
  govActionProposalId: string;

  @ApiProperty({ description: 'Reasoning title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Reasoning content' })
  @IsString()
  content: string;
}
