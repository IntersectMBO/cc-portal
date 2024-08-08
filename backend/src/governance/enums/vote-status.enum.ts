export enum VoteStatus {
  /**
   * Unvoted - There are neither votes nor rationales for the associated Governance Action Proposal for a particular user
   */
  Unvoted = 'unvoted',
  /**
   * Pending - There is no vote but there is a rationale for the associated Governance Action Proposal for a particular user
   */
  Pending = 'pending',
  /**
   * Voted - There are both votes and a rationale for the associated Governance Action Proposal for a particular user
   */
  Voted = 'voted',
}
