import { GovernanceActionFilterItems } from "@molecules";

export const GOVERNANCE_ACTIONS_FILTERS: Record<
  string,
  GovernanceActionFilterItems
> = {
  govActionType: {
    key: "govActionType",
    title: "Governance Action Type",
    items: [
      {
        key: "NoConfidence",
        label: "No Confidence",
      },
      {
        key: "NewCommittee",
        label: "New Constitutional Committee or Quorum Size",
      },
      {
        key: "NewConstitution",
        label: "Update to the Constitution",
      },
      {
        key: "HardForkInitiation",
        label: "Hard Fork",
      },
      {
        key: "ParameterChange",
        label: "Protocol Parameter Changes",
      },
      {
        key: "TreasuryWithdrawals",
        label: "Treasury Withdrawals",
      },
      {
        key: "InfoAction",
        label: "Info Action",
      },
    ],
  },
  vote: {
    key: "vote",
    title: "Vote",
    items: [
      {
        key: "YES",
        label: "Yes",
      },
      {
        key: "NO",
        label: "No",
      },
      {
        key: "ABSTAIN",
        label: "Abstain",
      },
    ],
  },
};
