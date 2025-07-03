export const PATHS = {
  home: "/",
  constitution: "/constitution",
  versionHistory: "/constitution/version-history",
  members: "/members",
  votingUpdates: "/voting-updates",
  myActions: "/my-actions",
  governanceActions: "/governance-actions",
  logout: "/logout",
  admin: {
    home: "/admin",
    dashboard: "/admin/dashboard",
  },
};

export const EXTERNAL_LINKS = {
  guides:
    "https://docs.gov.tools/about/what-is-the-constitutional-committee-portal",
  termsOfUse:
    "https://docs.intersectmbo.org/legal/policies-and-conditions/terms-of-use",
  privacyPolicy:
    "https://docs.intersectmbo.org/legal/policies-and-conditions/privacy-policy",
  guardrailsScript:
    "https://github.com/IntersectMBO/plutus/tree/master/cardano-constitution",
  guardrailsRationale:
    "https://docs.google.com/document/d/1FDVnDwugtA5RlgH8a-_8pWL_W-VGvMYA",
  elections: "https://elections.constitution.gov.tools/",
  constitutionDefinitions:
    "https://ipfs.io/ipfs/bafkreiewp5bgrdiesq6ft3qypykgcjhvfgpp4s5o4yrjrvko4wuhi4iecu",
};

export const adminProtectedPath = PATHS.admin.dashboard;
export const userProtectedPaths = [PATHS.myActions, PATHS.governanceActions];
