export enum VoteStatus {
  /**
   * Unvoted - There are neither votes nor reasoning for the associated GAP for a particular user
   */
  Unvoted = 'unvoted',
  /**
   * Pending - There is no vote but there is a reasoning for the associated GAP for a particular user
   */
  Pending = 'pending',
  /**
   * Voted - There are both votes and a reasoning for the associated GAP for a particular user
   */
  Voted = 'voted',
}
