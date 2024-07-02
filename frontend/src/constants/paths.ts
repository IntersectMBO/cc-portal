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

export const adminProtectedPath = PATHS.admin.dashboard;
export const userProtectedPaths = [PATHS.myActions, PATHS.governanceActions];
