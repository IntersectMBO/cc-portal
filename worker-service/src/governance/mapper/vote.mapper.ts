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
    voteRequest.voteMetadataUrl = dbSyncData.vote_url;
    voteRequest.vote = dbSyncData.vote;
    voteRequest.govActionProposalId = dbSyncData.gov_action_proposal_id;
    voteRequest.submitTime = dbSyncData.time;
    voteRequest.votingAnchorId = dbSyncData.voting_anchor_id;
    voteRequest.govActionType = dbSyncData.type;
    voteRequest.govMetadataUrl = dbSyncData.gap_url;
    voteRequest.status = dbSyncData.epoch_status;
    voteRequest.txHash = dbSyncData.hash;
    voteRequest.govActionProposalSubmitTime = dbSyncData.gap_submit_time;

    return voteRequest;
  }

  private static hotAddressFromBufferToHash(address: Buffer): string {
    const buffer = Buffer.from(address);
    const hashAddress = buffer.toString('hex');
    return hashAddress;
  }
}
