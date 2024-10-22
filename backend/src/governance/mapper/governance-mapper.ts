import { IpfsContentDto } from 'src/ipfs/dto/ipfs-content.dto';
import { GovernanceActionProposalResponse } from '../api/response/gov-action-proposal.response';
import { VoteResponse } from '../api/response/vote.response';
import {
  GovActionProposalDto,
  VoteStatusRationaleInfoDto as UserVoteStatusRationaleDto,
} from '../dto/gov-action-proposal-dto';
import { VoteDto } from '../dto/vote.dto';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { Vote } from '../entities/vote.entity';
import { GovActionProposalStatus } from '../enums/gov-action-proposal-status.enum';
import { VoteValue } from '../enums/vote-value.enum';
import { RationaleResponse } from '../api/response/rationale.response';
import { RationaleDto } from '../dto/rationale.dto';
import { RationaleRequest } from '../api/request/rationale.request';
import { Rationale } from '../entities/rationale.entity';
import { GovernanceActionProposalSearchResponse } from '../api/response/gov-action-proposal-search.response';
import { VoteStatus } from '../enums/vote-status.enum';

export class GovernanceMapper {
  static voteDtoToResponse(voteDto: VoteDto): VoteResponse {
    const voteResponse = new VoteResponse();
    voteResponse.userName = voteDto.userName;
    voteResponse.userPhotoUrl = voteDto.userPhotoUrl;
    voteResponse.userAddress = voteDto.userAddress;
    voteResponse.voteValue = voteDto.voteValue;
    voteResponse.rationaleUrl = voteDto.rationaleUrl;
    voteResponse.rationaleTitle = voteDto.rationaleTitle;
    voteResponse.rationaleComment = voteDto.rationaleComment;
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
    voteDto.rationaleUrl = vote.voteMetadataUrl;
    voteDto.rationaleTitle = vote.title;
    voteDto.rationaleComment = vote.comment;
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
    govActionProposalDto.submitTime = govActionProposal.submitTime;
    govActionProposalDto.endTime = govActionProposal.endTime;

    govActionProposalDto.votedBy = govActionProposal.votes?.map(
      (vote) => vote.userId,
    );
    govActionProposalDto.rationaleBy = govActionProposal.rationales?.map(
      (rationale) => rationale.userId,
    );
    return govActionProposalDto;
  }

  static returnUserVoteRationaleInfo(
    gapDto: GovActionProposalDto,
    userId: string,
  ): UserVoteStatusRationaleDto {
    const userHasVote = GovernanceMapper.userHasVote(gapDto.votedBy, userId);
    const userHasRationale = GovernanceMapper.userHasRationale(
      gapDto.rationaleBy,
      userId,
    );
    let voteStatus: VoteStatus;
    if (!userHasVote && !userHasRationale) {
      voteStatus = VoteStatus.Unvoted;
    } else if (!userHasVote && userHasRationale) {
      voteStatus = VoteStatus.Pending;
    } else {
      voteStatus = VoteStatus.Voted;
    }

    return new UserVoteStatusRationaleDto(voteStatus, userHasRationale);
  }

  private static userHasVote(votedBy: string[], userId: string): boolean {
    return votedBy?.some((vote) => vote === userId);
  }

  static userHasRationale(rationaleBy: string[], userId: string): boolean {
    return rationaleBy?.some((rationale) => rationale === userId);
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
    response.hasRationale = dto.hasRationale;
    response.type = dto.type;
    response.submitTime = dto.submitTime;
    response.endTime = dto.endTime;

    return response;
  }

  static ipfsContentDtoToRationaleDto(
    ipfsContentDto: IpfsContentDto,
    userId: string,
    proposalId: string,
    rationaleRequest: RationaleRequest,
  ): RationaleDto {
    const rationaleDto = new RationaleDto();
    rationaleDto.cid = ipfsContentDto.cid;
    rationaleDto.url = ipfsContentDto.url;
    rationaleDto.blake2b = ipfsContentDto.blake2b;
    rationaleDto.json = ipfsContentDto.contents;
    rationaleDto.userId = userId;
    rationaleDto.govActionProposalId = proposalId;
    rationaleDto.title = rationaleRequest.title;
    rationaleDto.content = rationaleRequest.content;
    return rationaleDto;
  }

  static rationaleToDto(rationale: Rationale): RationaleDto {
    const rationaleDto = new RationaleDto();
    rationaleDto.userId = rationale.userId;
    rationaleDto.govActionProposalId = rationale.govActionProposalId;
    rationaleDto.title = rationale.title;
    rationaleDto.content = rationale.content;
    rationaleDto.cid = rationale.cid;
    rationaleDto.blake2b = rationale.blake2b;
    rationaleDto.url = rationale.url;
    rationaleDto.json = rationale.json;
    return rationaleDto;
  }

  static rationaleDtoToResponse(dto: RationaleDto): RationaleResponse {
    const response = new RationaleResponse();
    response.cid = dto.cid;
    response.blake2b = dto.blake2b;
    response.url = dto.url;
    response.title = dto.title;
    response.contents = dto.json;
    return response;
  }
}
