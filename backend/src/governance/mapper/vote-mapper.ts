import { VoteResponse } from '../api/response/vote.response';
import { VoteDto } from '../dto/vote.dto';

export class VoteMapper {
  static voteDtoToResponse(voteDto: VoteDto): VoteResponse {
    const voteResponse = new VoteResponse();
    voteResponse.id = voteDto.id;
    voteResponse.userName = voteDto.userName;
    voteResponse.userAddress = voteDto.userAddress;
    voteResponse.voteValue = voteDto.voteValue;
    voteResponse.voteSubmitTime = voteDto.voteSubmitTime;
    voteResponse.govProposalType = voteDto.govProposalType;
    voteResponse.govProposalResolved = voteDto.govProposalResolved;
    voteResponse.govProposalEndTime = voteDto.govProposalEndTime;

    return voteResponse;
  }
}
