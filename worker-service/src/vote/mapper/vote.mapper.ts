import { VoteRequestDto } from '../dto/vote-request.dto';
import { VoteDto } from '../dto/vote.dto';
import { Vote } from '../entities/vote.entity';

export class VoteMapper {
  static votesToDto(voteData: Vote): VoteDto {
    const voteDto = new VoteDto();
    voteDto.createdAt = voteData.createdAt;
    voteDto.updatedAt = voteData.updatedAt;
    voteDto.id = voteData.id;
    voteDto.userId = voteData.userId;
    voteDto.hotAddress = voteData.hotAddress;
    voteDto.govActionProposalId =
      voteData.govActionProposal.govActionProposalId;
    voteDto.vote = voteData.vote;
    voteDto.title = voteData.title;
    voteDto.comment = voteData.comment;
    voteDto.govActionType = voteData.govActionType;
    voteDto.endTime = voteData.endTime;
    voteDto.submitTime = voteData.submitTime;
    return voteDto;
  }

  // static voteToDto(vote: Vote): VoteDto {
  //   const voteDto = new VoteDto();
  //   voteDto.userId = vote.userId;
  //   voteDto.hotAddress = vote.hotAddress;
  //   voteDto.govActionProposalId = vote.govActionProposalId;
  //   voteDto.vote = vote.vote;
  //   voteDto.title = vote.title;
  //   voteDto.comment = vote.comment;
  //   voteDto.type = vote.type;
  //   voteDto.endTime = vote.endTime;
  //   voteDto.time = vote.time;
  //   voteDto.createdAt = vote.createdAt;
  //   voteDto.updatedAt = vote.updatedAt;
  //   return voteDto;
  // }

  static objectToVotesRequest(input): VoteRequestDto {
    const voteRequestDto = new VoteRequestDto();
    voteRequestDto.userId = input.user_id;
    voteRequestDto.hotAddress = input.hot_address;
    voteRequestDto.govActionProposalId = input.gov_action_proposal_id;
    voteRequestDto.vote = input.vote;
    voteRequestDto.title = input.title;
    voteRequestDto.comment = input.comment;
    voteRequestDto.type = input.type;
    voteRequestDto.govMetadataUrl = input.gov_metadata_url;
    voteRequestDto.endTime = input.end_time;
    voteRequestDto.time = input.time;
    return voteRequestDto;
  }
}
