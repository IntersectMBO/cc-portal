import { FilterItem } from "@molecules";

export const VOTING_UPDATES_SORTING: FilterItem[] = [
  {
    key: "submitTime:ASC",
    label: "Newest first",
  },
  {
    key: "submitTime:DESC",
    label: "Latest first",
  },
  {
    key: "govActionProposal.title:ASC",
    label: "Title ASC",
  },
  {
    key: "govActionProposal.title:DESC",
    label: "Title DESC",
  },
];

export const GOVERNANCE_ACTIONS_SORTING: FilterItem[] = [
  {
    key: "submitTime:ASC",
    label: "Newest first",
  },
  {
    key: "submitTime:DESC",
    label: "Latest first",
  },
  {
    key: "endTime:ASC",
    label: "Expire first",
  },
  {
    key: "endTime:DESC",
    label: "Latest expire",
  },
];

export const CC_MEMBERS_SORTING: FilterItem[] = [
  {
    key: "name:ASC",
    label: "Name ASC",
  },
  {
    key: "name:DESC",
    label: "Name DESC",
  },
];
