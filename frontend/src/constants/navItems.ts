import { EXTERNAL_LINKS, PATHS } from "./paths";

export const NAV_ITEMS = [
  {
    dataTestId: "constitution-link",
    href: PATHS.constitution,
    label: "Read the Constitution",
    newTabLink: null,
  },
  {
    dataTestId: "members",
    href: PATHS.members,
    label: "Members",
    newTabLink: null,
  },
  {
    dataTestId: "votingUpdates",
    href: PATHS.votingUpdates,
    label: "Voting Updates",
    newTabLink: null,
  },
  {
    dataTestId: "elections",
    href: EXTERNAL_LINKS.elections,
    label: "Elections",
    newTabLink: true,
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
