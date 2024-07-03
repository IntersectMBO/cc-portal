export enum VoteStatus {
  /**
   * Unvoted - There are neither votes nor reasoning for the associated GAP for a particular user
   */
  Unvoted = 'Unvoted',
  /**
   * Pending - There is no vote but there is a reasoning for the associated GAP for a particular user
   */
  Pending = 'Pending',
  /**
   * Voted - There are both votes and a reasoning for the associated GAP for a particular user
   */
  Voted = 'Voted',
}
