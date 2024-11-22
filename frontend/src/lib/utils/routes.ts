import {
  adminProtectedPath,
  PATHS,
  userProtectedPaths
} from "@/constants/paths";
import { NextRequest } from "next/server";
import { UserRole } from "../requests";
import { isAnyAdminRole } from "./roles";

/**
 * Checks if the current request URL is an admin-protected route.
 *
 * Admin-protected routes are URLs that require admin privileges to access.
 * This function determines if the URL in the request matches the predefined
 * admin protected path, indicating that it is an admin-protected route.
 *
 * @param req - The NextRequest object containing the request URL.
 * @returns `true` if the request URL matches the admin protected path, otherwise `false`.
 */
export const isAdminProtectedRoute = (req: NextRequest): boolean =>
  req.nextUrl.pathname.includes(adminProtectedPath);

/**
 * Checks if the current request URL is a user-protected route.
 *
 * User-protected routes are URLs that require user authentication to access.
 * This function checks if the request URL matches any of the predefined
 * user protected paths, indicating that it is a user-protected route.
 *
 * @param req - The NextRequest object containing the request URL.
 * @returns `true` if the request URL matches any of the user protected paths, otherwise `false`.
 */
export const isUserProtectedRoute = (req: NextRequest): boolean =>
  userProtectedPaths.some((path) => req.nextUrl.pathname.includes(path));

/**
 * Determines the appropriate redirect URL based on the user's role.
 *
 * This function provides the URL to which the user should be redirected
 * based on their role. If the user has an admin role, the function returns
 * the admin home path. For other roles, it returns the default home path.
 *
 * @param role - The role of the user. It should be one of the predefined user roles (UserRole).
 * @returns The URL to redirect the user based on their role.
 *
 * @example
 * // Get the redirect URL for an admin role
 * getRoleBasedHomeRedirectURL('admin'); // Returns: '/admin'
 *
 * @example
 * // Get the redirect URL for a non-admin role
 * getRoleBasedHomeRedirectURL('user'); // Returns: '/'
 */
export const getRoleBasedHomeRedirectURL = (role: UserRole): string => {
  let redirectUrl = PATHS.home;
  if (isAnyAdminRole(role)) {
    redirectUrl = PATHS.home;
  }
  return redirectUrl;
};
