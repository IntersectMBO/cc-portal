// Import createMiddleware from next-intl to configure internationalization middleware for Next.js.
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, PATHS } from "@consts";
import { isTokenExpired, refreshToken, decodeUserToken } from "./lib/api";
import * as cookie from "cookie";
import {
  isAdminProtectedRoute,
  isAnyAdminRole,
  isUserProtectedRoute,
  getAuthCookies,
} from "@utils";

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
    "/my-actions",
    "/governance-actions",
    "/members",
    "/admin",
    "/admin/dashboard",
    "/logout",
    "/(de|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // However, match all pathnames within `/users`, optionally with a locale prefix
    "/([\\w-]+)?/users/(.+)",
  ], // Apply middleware to the root path and any path prefixed with supported locales.
};

export async function middleware(req: NextRequest) {
  // This setup applies internationalization strategies across the application.
  const response = intlMiddleware(req);

  // Decode user token to check user role
  const decodedToken = await decodeUserToken();
  const { token, refresh_token } = getAuthCookies();

  const isRefreshTokenExpired =
    !!refresh_token && (await isTokenExpired(refresh_token));
  const isLogoutPage = req.nextUrl.pathname.includes("logout");

  // Clear authentication tokens from cookies on Logout page
  // Logout page, when rendered, clears the user session in the client-side context state,
  // and redirects the user to the appropriate URL.
  if (isLogoutPage) {
    response.cookies.set("token", "", { maxAge: 0 });
    response.cookies.set("refresh_token", "", { maxAge: 0 });

    return response;
  }

  //Check if access token is expired and redirect to logout page if necessary
  if (isRefreshTokenExpired) {
    return NextResponse.redirect(new URL(PATHS.logout, req.url));
  }

  // Check if access token is expired and refresh if necessary
  if (!!token && (await isTokenExpired(token))) {
    try {
      const newToken = await refreshToken(refresh_token);
      // Rewrite cookies and headers with new token
      const newRequestHeaders = withRewrittenCookieHeader(
        req.headers,
        newToken
      );
      // Return updated response with new token
      const response = NextResponse.next({
        request: {
          headers: newRequestHeaders,
        },
      });
      response.cookies.set("token", newToken?.access_token);
      response.cookies.set("refresh_token", newToken?.refresh_token);

      return response;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return NextResponse.error();
    }
  }

  // Check if the route requires admin role
  if (isAdminProtectedRoute(req)) {
    if (decodedToken) {
      const { role } = decodedToken;
      //Allow access only if user is logged in and has admin role
      if (isAnyAdminRole(role)) {
        return response;
      }
      // If a logged-in user without admin permissions attempts to access the admin dashboard, redirect to the main user app
      return NextResponse.redirect(new URL(PATHS.home, req.url));
    }
    // If no access token is found, redirect to the admin home page
    return NextResponse.redirect(new URL(PATHS.admin.home, req.url));
  }

  // Check if the route requires user role
  if (isUserProtectedRoute(req)) {
    if (decodedToken) {
      return response;
    }
    // If no access token is found, redirect to the user home page
    return NextResponse.redirect(new URL(PATHS.home, req.url));
  }
  return response;
}

// Function to update request headers with new token
function withRewrittenCookieHeader(
  requestHeaders: Headers,
  newToken: any
): Headers {
  const cookiesHeader = requestHeaders.get("cookie");
  const parsedCookies = cookie.parse(cookiesHeader || "");

  parsedCookies["token"] = newToken?.access_token;
  parsedCookies["refresh_token"] = newToken?.refresh_token;

  const serializedCookies = Object.entries(parsedCookies)
    .map(([key, value]) => cookie.serialize(key, value))
    .join("; ");

  const newRequestHeaders = new Headers(requestHeaders);
  newRequestHeaders.set("cookie", serializedCookies);
  newRequestHeaders.set("Authorization", `Bearer ${newToken?.access_token}`);

  return newRequestHeaders;
}
