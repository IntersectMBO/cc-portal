import { GovernanceActionMetadataResponse as GovActionMetadataResponse } from '../api/response/gov-action-metadata.response';
import { VoteResponse } from '../api/response/vote.response';
import { GovActionMetaDto } from '../dto/gov-action-meta.dto';
import { VoteDto } from '../dto/vote.dto';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { Vote } from '../entities/vote.entity';
import { GovActionProposalStatus } from '../enums/gov-action-proposal-status.enum';
import { VoteValue } from '../enums/vote-value.enum';

export class GovernanceMapper {
  static voteDtoToResponse(voteDto: VoteDto): VoteResponse {
    const voteResponse = new VoteResponse();
    voteResponse.userName = voteDto.userName;
    voteResponse.userPhotoUrl = voteDto.userPhotoUrl;
    voteResponse.userAddress = voteDto.userAddress;
    voteResponse.voteValue = voteDto.voteValue;
    voteResponse.reasoningTitle = voteDto.reasoningTitle;
    voteResponse.reasoningComment = voteDto.reasoningComment;
    voteResponse.govProposalId = voteDto.govProposalId;
    voteResponse.govProposalTitle = voteDto.govProposalTitle;
    voteResponse.voteSubmitTime = voteDto.voteSubmitTime;
    voteResponse.govProposalType = voteDto.govProposalType;
    voteResponse.govProposalStatus = voteDto.govProposalStatus;
    voteResponse.govProposalEndTime = voteDto.govProposalEndTime;

    return voteResponse;
  }

  static voteToDto(vote: Vote): VoteDto {
    const voteDto = new VoteDto();
    voteDto.userId = vote.userId;
    voteDto.userAddress = vote.hotAddress;
    voteDto.voteValue = VoteValue[vote.vote];
    voteDto.reasoningTitle = vote.title;
    voteDto.reasoningComment = vote.comment;
    voteDto.govProposalId = vote.govActionProposal?.id;
    voteDto.govProposalTitle = vote.govActionProposal?.title;
    voteDto.voteSubmitTime = vote.submitTime;
    voteDto.govProposalType = vote.govActionType;
    voteDto.govProposalStatus =
      GovActionProposalStatus[vote.govActionProposal.status];
    voteDto.govProposalEndTime = vote.endTime;

    return voteDto;
  }

  static govActionProposalToDto(
    govActionProposal: GovActionProposal,
  ): GovActionMetaDto {
    const govActionMetaDto = new GovActionMetaDto();
    govActionMetaDto.id = govActionProposal.id;
    govActionMetaDto.title = govActionProposal.title;
    govActionMetaDto.abstract = govActionProposal.abstract;
    govActionMetaDto.metadataUrl = govActionProposal.govMetadataUrl;

    return govActionMetaDto;
  }

  static govActionMetaDtoToResponse(
    dto: GovActionMetaDto,
  ): GovActionMetadataResponse {
    const response = new GovActionMetadataResponse();
    response.id = dto.id;
    response.title = dto.title;
    response.abstract = dto.abstract;
    response.metadataUrl = dto.metadataUrl;

    return response;
  }
}
