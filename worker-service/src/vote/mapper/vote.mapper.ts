import { VoteRequest } from '../dto/vote.request';

export class VoteMapper {
  static dbSyncToVoteRequest(
    dbSyncData,
    mapHotAddresses: Map<string, string>,
  ): VoteRequest {
    const voteRequest = new VoteRequest();
    voteRequest.id = dbSyncData.id;
    voteRequest.hotAddress = this.hotAddressFromBufferToHash(dbSyncData.raw);
    mapHotAddresses.forEach((val, key) => {
      if (key === voteRequest.hotAddress) {
        voteRequest.userId = val;
      }
    });
    voteRequest.title = dbSyncData.title;
    voteRequest.comment = dbSyncData.comment;
    voteRequest.vote = dbSyncData.vote;
    voteRequest.govActionProposalId = dbSyncData.gov_action_proposal_id;
    voteRequest.votingAnchorId = dbSyncData.voting_anchor_id;
    voteRequest.govActionType = dbSyncData.type;
    voteRequest.submitTime = dbSyncData.time;
    voteRequest.endTime = dbSyncData.end_time;
    voteRequest.govMetadataUrl = dbSyncData.url;
    voteRequest.status = dbSyncData.status;
    return voteRequest;
  }

  private static hotAddressFromBufferToHash(address: Buffer): string {
    const buffer = Buffer.from(address);
    const hashAddress = '\\x' + buffer.toString('hex');
    return hashAddress;
  }
}
