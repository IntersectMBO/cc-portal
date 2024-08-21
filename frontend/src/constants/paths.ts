export const PATHS = {
  home: "/",
  constitution: "/interim-constitution",
  members: "/members",
  latestUpdates: "/latest-updates",
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
    "https://app.gitbook.com/o/Prbm1mtkwSsGWSvG1Bfd/s/IOUshfMdffqF4RObLhje/legal/terms-and-conditions",
};

export const adminProtectedPath = PATHS.admin.dashboard;
export const userProtectedPaths = [PATHS.myActions, PATHS.governanceActions];
