import { IpfsContentDto } from 'src/ipfs/dto/ipfs-content.dto';
import { GovernanceActionMetadataResponse as GovActionMetadataResponse } from '../api/response/gov-action-metadata.response';
import { VoteResponse } from '../api/response/vote.response';
import { GovActionProposalDto } from '../dto/gov-action-proposal-dto';
import { VoteDto } from '../dto/vote.dto';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { Vote } from '../entities/vote.entity';
import { GovActionProposalStatus } from '../enums/gov-action-proposal-status.enum';
import { VoteValue } from '../enums/vote-value.enum';
import { ReasoningResponse } from '../api/response/reasoning.response';
import { ReasoningDto } from '../dto/reasoning.dto';
import { ReasoningRequest } from '../api/request/reasoning.request';
import { Reasoning } from '../entities/reasoning.entity';

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
  ): GovActionProposalDto {
    const govActionProposalDto = new GovActionProposalDto();
    govActionProposalDto.id = govActionProposal.id;
    govActionProposalDto.title = govActionProposal.title;
    govActionProposalDto.abstract = govActionProposal.abstract;
    govActionProposalDto.metadataUrl = govActionProposal.govMetadataUrl;

    return govActionProposalDto;
  }

  static govActionMetaDtoToResponse(
    dto: GovActionProposalDto,
  ): GovActionMetadataResponse {
    const response = new GovActionMetadataResponse();
    response.id = dto.id;
    response.title = dto.title;
    response.abstract = dto.abstract;
    response.metadataUrl = dto.metadataUrl;

    return response;
  }

  static ipfsContentDtoToReasoningDto(
    ipfsContentDto: IpfsContentDto,
    userId: string,
    reasoningRequest: ReasoningRequest,
  ): ReasoningDto {
    const reasoningDto = new ReasoningDto();
    reasoningDto.cid = ipfsContentDto.cid;
    reasoningDto.url = ipfsContentDto.url;
    reasoningDto.blake2b = ipfsContentDto.blake2b;
    reasoningDto.json = ipfsContentDto.contents;
    reasoningDto.userId = userId;
    reasoningDto.govActionProposalId = reasoningRequest.govActionProposalId;
    reasoningDto.title = reasoningRequest.title;
    reasoningDto.content = reasoningRequest.content;
    return reasoningDto;
  }

  static reasoningToDto(reasoning: Reasoning): ReasoningDto {
    const reasoningDto = new ReasoningDto();
    reasoningDto.id = reasoning.id;
    reasoningDto.userId = reasoning.userId;
    reasoningDto.title = reasoning.title;
    reasoningDto.content = reasoning.content;
    reasoningDto.cid = reasoning.cid;
    reasoningDto.blake2b = reasoning.blake2b;
    reasoningDto.url = reasoning.url;
    reasoningDto.json = reasoning.json;
    reasoningDto.govActionProposalId = reasoning.govActionProposalId;
    return reasoningDto;
  }

  static reasoningDtoToResponse(dto: ReasoningDto): ReasoningResponse {
    const response = new ReasoningResponse();
    response.cid = dto.cid;
    response.blake2b = dto.blake2b;
    response.url = dto.url;
    response.contents = dto.json;
    return response;
  }
}
