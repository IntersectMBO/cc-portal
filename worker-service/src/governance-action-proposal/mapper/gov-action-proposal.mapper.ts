import { GovActionProposalDto } from '../dto/gov-action-proposal.dto';
import { GovActionProposalRequest } from '../dto/gov-action-proposal.request';
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
    govActionProposalDto.govActionType = govActionProposal.govActionType;
    govActionProposalDto.txHash = govActionProposal.txHash;
    return govActionProposalDto;
  }

  static dbSyncToGovActionProposalRequest(
    dbSyncData,
  ): GovActionProposalRequest {
    const govActionProposalRequest = new GovActionProposalRequest();
    govActionProposalRequest.id = dbSyncData.id;
    govActionProposalRequest.votingAnchorId = dbSyncData.voting_anchor_id;
    govActionProposalRequest.govActionType = dbSyncData.type;
    govActionProposalRequest.govMetadataUrl = dbSyncData.url;
    govActionProposalRequest.status = dbSyncData.epoch_status;
    govActionProposalRequest.endTime = dbSyncData.end_time;
    govActionProposalRequest.txHash = Buffer.from(dbSyncData.hash)
      .toString('hex')
      .toUpperCase();

    return govActionProposalRequest;
  }
}
