import { VoteRequestDto } from '../dto/vote-request.dto';
import { VoteDto } from '../dto/vote.dto';
import { Vote } from '../entities/vote.entity';

export class VoteMapper {
  static votesToDto(voteData: Vote[]): VoteDto[] {
    const voteDtoArray: VoteDto[] = [];
    voteData.map((x) => {
      const voteDto = new VoteDto();
      voteDto.createdAt = x.createdAt;
      voteDto.updatedAt = x.updatedAt;
      voteDto.id = x.id;
      voteDto.userId = x.userId;
      voteDto.hotAddress = x.hotAddress;
      voteDto.govActionProposalId = x.govActionProposalId;
      voteDto.vote = x.vote;
      voteDto.title = x.title;
      voteDto.comment = x.comment;
      voteDto.type = x.type;
      voteDto.govMetadataUrl = x.govMetadataUrl;
      voteDto.endTime = x.endTime;
      voteDto.time = x.time;
    });
    return voteDtoArray;
  }

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
