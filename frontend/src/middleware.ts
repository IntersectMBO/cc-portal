// Import createMiddleware from next-intl to configure internationalization middleware for Next.js.
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, PATHS } from "@consts";
import { isAdminProtectedRoute, isAnyAdminRole } from "@utils";
import { decodeUserToken } from "./lib/api";

// Export the middleware configuration to define supported locales and the default locale.
const intlMiddleware = createMiddleware({
  locales: locales, // Specify the supported locales for the application.
  defaultLocale: defaultLocale, // Set the default locale to be used when no other locale matches.
});

// Define and export a config object to specify which paths the middleware should apply to.
// This ensures the internationalization logic only runs for specified routes.
export const config = {
  matcher: [
    "/",
    "/interim-constitution",
    "/latest-updates",
    "/members",
    "/admin",
    "/admin/dashboard",
    "/(de|en)/:path*",
  ], // Apply middleware to the root path and any path prefixed with supported locales.
};

export async function middleware(req: NextRequest) {
  // This setup applies internationalization strategies across the application.
  const response = intlMiddleware(req);
  const decodedToken = await decodeUserToken();

  if (isAdminProtectedRoute(req)) {
    if (decodedToken) {
      const { role } = decodedToken;
      if (isAnyAdminRole(role)) {
        return response;
      }
    }

    return NextResponse.redirect(new URL(PATHS.admin.home, req.url));
  }
  return response;
}
