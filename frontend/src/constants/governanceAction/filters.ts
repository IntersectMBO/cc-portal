import { FilterItems } from "@molecules";

export const LATEST_UPDATES_FILTERS: Record<string, FilterItems> = {
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
        key: "Yes",
        label: "Yes",
      },
      {
        key: "No",
        label: "No",
      },
      {
        key: "Abstain",
        label: "Abstain",
      },
    ],
  },
};

export const GOVERNANCE_ACTIONS_FILTERS: Record<string, FilterItems> = {
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
  status: {
    key: "status",
    title: "Status",
    items: [
      {
        key: "voted",
        label: "Voted",
      },
      {
        key: "unvoted",
        label: "Unvoted",
      },
      {
        key: "pending",
        label: "Pending",
      },
    ],
  },
};
