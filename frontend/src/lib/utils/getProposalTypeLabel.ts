import { GOVERNANCE_ACTIONS_FILTERS } from "@/constants/governanceAction";

export const getProposalTypeLabel = (type: string) => {
  const label = GOVERNANCE_ACTIONS_FILTERS.govActionType.items.find(
    (i) => i.key === type
  )?.label;
  return label || type;
};
