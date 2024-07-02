import { adminProtectedPath, PATHS, userProtectedPaths } from "@consts";
import { NextRequest } from "next/server";
import { UserRole } from "../requests";
import { isAnyAdminRole } from "./roles";

// Function to check if the current request URL belongs to an admin-protected route
export const isAdminProtectedRoute = (req: NextRequest): boolean =>
  req.nextUrl.pathname.includes(adminProtectedPath);

// Function to check if the current request URL is a user-protected route
// These routes should only be accessible to logged-in users
export const isUserProtectedRoute = (req: NextRequest): boolean =>
  userProtectedPaths.some((path) => req.nextUrl.pathname.includes(path));

/**
 * Determines the appropriate redirect URL based on the user's role.
 * If the user has an admin role, returns the admin home path; otherwise, returns the default home path.
 *
 * @param role - The role of the user.
 * @returns The redirect URL based on the user's role.
 */
export const getRoleBasedHomeRedirectURL = (role: UserRole): string => {
  let redirectUrl = PATHS.home;
  if (isAnyAdminRole(role)) {
    redirectUrl = PATHS.admin.home;
  }
  return redirectUrl;
};
