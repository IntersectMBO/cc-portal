import { PATHS } from "./paths";

export const NAV_ITEMS = [
  {
    dataTestId: "constitution-link",
    href: PATHS.constitution,
    label: "Interim Constitution",
    newTabLink: null,
  },
  {
    dataTestId: "members",
    href: PATHS.members,
    label: "Members",
    newTabLink: null,
  },
  {
    dataTestId: "latestUpdates",
    href: PATHS.latestUpdates,
    label: "Latest Updates",
    newTabLink: null,
  },
];

export const PROTECTED_NAV_ITEMS = [
  {
    dataTestId: "my-actions",
    href: PATHS.myActions,
    label: "My Actions",
    newTabLink: null,
  },
];
