import { FilterItem } from "@molecules";

export const LATEST_UPDATES_SORTING: FilterItem[] = [
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
    key: "expireTime:ASC",
    label: "Expire first",
  },
  {
    key: "expireTime:DESC",
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
