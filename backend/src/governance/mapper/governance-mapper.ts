import { IpfsContentDto } from 'src/ipfs/dto/ipfs-content.dto';
import { GovernanceActionProposalResponse } from '../api/response/gov-action-proposal.response';
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
import { GovernanceActionProposalSearchResponse } from '../api/response/gov-action-proposal-search.response';
import { VoteStatus } from '../enums/vote-status.enum';

export class GovernanceMapper {
  static voteDtoToResponse(voteDto: VoteDto): VoteResponse {
    const voteResponse = new VoteResponse();
    voteResponse.userName = voteDto.userName;
    voteResponse.userPhotoUrl = voteDto.userPhotoUrl;
    voteResponse.userAddress = voteDto.userAddress;
    voteResponse.voteValue = voteDto.voteValue;
    voteResponse.rationaleTitle = voteDto.reasoningTitle;
    voteResponse.rationaleComment = voteDto.reasoningComment;
    voteResponse.govActionProposalId = voteDto.govActionProposalId;
    voteResponse.govActionProposalTxHash = voteDto.govActionProposalTxHash;
    voteResponse.govActionProposalTitle = voteDto.govActionProposalTitle;
    voteResponse.voteSubmitTime = voteDto.voteSubmitTime;
    voteResponse.govActionProposalType = voteDto.govActionProposalType;
    voteResponse.govActionProposalStatus = voteDto.govActionProposalStatus;
    voteResponse.govActionProposalEndTime = voteDto.govActionProposalEndTime;

    return voteResponse;
  }

  static voteToDto(vote: Vote): VoteDto {
    const voteDto = new VoteDto();
    voteDto.userId = vote.userId;
    voteDto.userAddress = vote.hotAddress;
    voteDto.voteValue = VoteValue[vote.vote];
    voteDto.reasoningTitle = vote.title;
    voteDto.reasoningComment = vote.comment;
    voteDto.govActionProposalId = vote.govActionProposal?.id;
    voteDto.govActionProposalTxHash = vote.govActionProposal?.txHash;
    voteDto.govActionProposalTitle = vote.govActionProposal?.title;
    voteDto.voteSubmitTime = vote.submitTime;
    voteDto.govActionProposalType = vote.govActionProposal.govActionType;
    voteDto.govActionProposalStatus =
      GovActionProposalStatus[vote.govActionProposal.status];
    voteDto.govActionProposalEndTime = vote.govActionProposal.endTime;

    return voteDto;
  }

  static govActionProposalToDto(
    govActionProposal: GovActionProposal,
  ): GovActionProposalDto {
    const govActionProposalDto = new GovActionProposalDto();
    govActionProposalDto.id = govActionProposal.id;
    govActionProposalDto.txHash = govActionProposal.txHash;
    govActionProposalDto.title = govActionProposal.title;
    govActionProposalDto.abstract = govActionProposal.abstract;
    govActionProposalDto.metadataUrl = govActionProposal.govMetadataUrl;
    govActionProposalDto.type = govActionProposal.govActionType;
    govActionProposalDto.status =
      GovActionProposalStatus[govActionProposal.status];
    govActionProposalDto.voteStatus =
      GovernanceMapper.returnVoteStatusForGovActionProposal(govActionProposal);
    govActionProposalDto.hasReasoning = !GovernanceMapper.emptyArray(
      govActionProposal.reasonings,
    );
    govActionProposalDto.submitTime = govActionProposal.submitTime;
    govActionProposalDto.endTime = govActionProposal.endTime;

    return govActionProposalDto;
  }

  private static returnVoteStatusForGovActionProposal(
    govActionProposal: GovActionProposal,
  ): VoteStatus {
    if (
      GovernanceMapper.emptyArray(govActionProposal.votes) &&
      GovernanceMapper.emptyArray(govActionProposal.reasonings)
    ) {
      return VoteStatus.Unvoted;
    } else if (
      GovernanceMapper.emptyArray(govActionProposal.votes) &&
      !GovernanceMapper.emptyArray(govActionProposal.reasonings)
    ) {
      return VoteStatus.Pending;
    }
    return VoteStatus.Voted;
  }

  private static emptyArray(array: any[]): boolean {
    if (Array.isArray(array) && array.length) {
      return false;
    }
    return true;
  }

  static govActionProposalDtoToResponse(
    dto: GovActionProposalDto,
  ): GovernanceActionProposalResponse {
    const response = new GovernanceActionProposalResponse();
    response.id = dto.id;
    response.txHash = dto.txHash;
    response.title = dto.title;
    response.abstract = dto.abstract;
    response.metadataUrl = dto.metadataUrl;
    response.status = dto.status;
    response.type = dto.type;
    response.submitTime = dto.submitTime;
    response.endTime = dto.endTime;

    return response;
  }

  static govActionProposalDtoToSearchResponse(
    dto: GovActionProposalDto,
  ): GovernanceActionProposalSearchResponse {
    const response = new GovernanceActionProposalSearchResponse();
    response.id = dto.id;
    response.txHash = dto.txHash;
    response.title = dto.title;
    response.metadataUrl = dto.metadataUrl;
    response.status = dto.status;
    response.voteStatus = dto.voteStatus;
    response.hasRationale = dto.hasReasoning;
    response.type = dto.type;
    response.submitTime = dto.submitTime;
    response.endTime = dto.endTime;

    return response;
  }

  static ipfsContentDtoToReasoningDto(
    ipfsContentDto: IpfsContentDto,
    userId: string,
    proposalId: string,
    reasoningRequest: ReasoningRequest,
  ): ReasoningDto {
    const reasoningDto = new ReasoningDto();
    reasoningDto.cid = ipfsContentDto.cid;
    reasoningDto.url = ipfsContentDto.url;
    reasoningDto.blake2b = ipfsContentDto.blake2b;
    reasoningDto.json = ipfsContentDto.contents;
    reasoningDto.userId = userId;
    reasoningDto.govActionProposalId = proposalId;
    reasoningDto.title = reasoningRequest.title;
    reasoningDto.content = reasoningRequest.content;
    return reasoningDto;
  }

  static reasoningToDto(reasoning: Reasoning): ReasoningDto {
    const reasoningDto = new ReasoningDto();
    reasoningDto.userId = reasoning.userId;
    reasoningDto.govActionProposalId = reasoning.govActionProposalId;
    reasoningDto.title = reasoning.title;
    reasoningDto.content = reasoning.content;
    reasoningDto.cid = reasoning.cid;
    reasoningDto.blake2b = reasoning.blake2b;
    reasoningDto.url = reasoning.url;
    reasoningDto.json = reasoning.json;
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
