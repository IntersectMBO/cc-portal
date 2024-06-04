import { adminProtectedPath, PROTECTED_NAV_ITEMS } from "@consts";
import { NextRequest } from "next/server";

export const userProtectedPaths = PROTECTED_NAV_ITEMS.map((item) => item.href);

// Function to check if the current request URL belongs to an admin-protected route
export const isAdminProtectedRoute = (req: NextRequest): boolean =>
  req.nextUrl.pathname.includes(adminProtectedPath);

// Function to check if the current request URL is a user-protected route
// These routes should only be accessible to logged-in users
export const isUserProtectedRoute = (req: NextRequest): boolean =>
  userProtectedPaths.some((path) => req.nextUrl.pathname.includes(path));
