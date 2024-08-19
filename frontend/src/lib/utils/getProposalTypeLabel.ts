import { GOVERNANCE_ACTIONS_FILTERS } from "@/constants/governanceAction";

/**
 * Retrieves the display label for a given proposal type.
 *
 * This function looks up the label associated with a specific proposal type from a predefined
 * set of governance action filters (GOVERNANCE_ACTIONS_FILTERS).
 *
 * @param type - The proposal type to look up. This should match one of the keys defined in the
 *               `GOVERNANCE_ACTIONS_FILTERS.govActionType.items` array.
 * @returns The display label for the given proposal type, or the proposal type itself if no label is found.
 *
 * @example
 * getProposalTypeLabel('NoConfidence'); // Returns: 'No Confidence'
 * getProposalTypeLabel('UnknownType'); // Returns: 'UnknownType'
 */
export const getProposalTypeLabel = (type: string) => {
  const label = GOVERNANCE_ACTIONS_FILTERS.govActionType.items.find(
    (i) => i.key === type
  )?.label;
  return label || type;
};
