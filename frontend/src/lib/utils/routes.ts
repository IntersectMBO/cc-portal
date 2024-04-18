import { adminProtectedPath } from "@consts";
import { NextRequest } from "next/server";

// Function to check if the current request URL belongs to an admin-protected route
export const isAdminProtectedRoute = (req: NextRequest): boolean =>
  req.nextUrl.pathname.includes(adminProtectedPath);
