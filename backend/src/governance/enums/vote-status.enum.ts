export enum VoteStatus {
  /**
   * Unvoted - There are neither votes nor reasoning for the associated GAP
   */
  Unvoted = 'Unvoted',
  /**
   * Pending - There is no vote but there is a reasoning for the associated GAP
   */
  Pending = 'Pending',
  /**
   * Voted - There are both votes and a reasoning for the associated GAP
   */
  Voted = 'Voted',
}
