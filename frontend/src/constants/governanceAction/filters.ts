import { FilterItems } from "@molecules";

export const VOTING_UPDATES_FILTERS: Record<string, FilterItems> = {
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
        label: "CONSTITUTIONAL",
      },
      {
        key: "No",
        label: "UNCONSTITUTIONAL",
      },
      {
        key: "Abstain",
        label: "Abstain",
      },
    ],
  },

  voteMetadataUrl: {
    key: "voteMetadataUrl",
    title: "Rationale",
    items: [
      { key: "$not:$null", label: "Available" },
      { key: "$or:$null", label: "Not Available" },
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
    title: "GA Status",
    items: [
      {
        key: "ACTIVE",
        label: "Active",
      },
      {
        key: "EXPIRED",
        label: "Expired",
      },
      {
        key: "RATIFIED",
        label: "Ratified",
      },
      {
        key: "ENACTED",
        label: "Enacted",
      },
      {
        key: "DROPPED",
        label: "Dropped ",
      },
    ],
  },
};
