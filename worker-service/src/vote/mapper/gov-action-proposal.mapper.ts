import { GovActionProposalDto } from '../dto/gov-action-proposal.dto';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';

export class GovActionProposalMapper {
  static GovActionProposalToDto(
    govActionProposal: GovActionProposal,
  ): GovActionProposalDto {
    const govActionProposalDto = new GovActionProposalDto();
    govActionProposalDto.id = govActionProposal.id;
    govActionProposalDto.title = govActionProposal.title;
    govActionProposalDto.abstract = govActionProposal.abstract;
    govActionProposalDto.votingAnchorId = govActionProposal.votingAnchorId;
    govActionProposalDto.govMetadataUrl = govActionProposal.govMetadataUrl;
    return govActionProposalDto;
  }
}
