import { NextRequest } from "next/server";
import {
  isAdminProtectedRoute,
  isUserProtectedRoute,
  getRoleBasedHomeRedirectURL,
} from "../../lib/utils/routes";
import {
  PATHS,
  userProtectedPaths,
  adminProtectedPath,
} from "@/constants/paths";
import { UserRole } from "../../lib/requests";

// Flatten PATHS, extract all paths, including those nested within objects.
const allPaths = Object.values(PATHS).flatMap((path) =>
  typeof path === "string" ? path : Object.values(path)
);

describe("Route Functions", () => {
  describe("isAdminProtectedRoute", () => {
    it("should return true for admin-protected routes", () => {
      const req = {
        nextUrl: { pathname: adminProtectedPath },
      } as unknown as NextRequest;
      expect(isAdminProtectedRoute(req)).toBe(true);
    });

    it("should return false for non-admin routes", () => {
      const nonAdminPaths = allPaths.filter(
        (path) => path !== adminProtectedPath
      );

      nonAdminPaths.forEach((path) => {
        const req = {
          nextUrl: { pathname: path },
        } as unknown as NextRequest;
        expect(isAdminProtectedRoute(req)).toBe(false);
      });
    });
  });

  describe("isUserProtectedRoute", () => {
    it("should return true for user-protected routes", () => {
      userProtectedPaths.forEach((path) => {
        const req = {
          nextUrl: { pathname: path },
        } as unknown as NextRequest;
        expect(isUserProtectedRoute(req)).toBe(true);
      });
    });

    it("should return false for non-user routes", () => {
      const nonUserPaths = allPaths.filter(
        (path) => !userProtectedPaths.includes(path)
      );

      nonUserPaths.forEach((path) => {
        const req = {
          nextUrl: { pathname: path },
        } as unknown as NextRequest;
        expect(isUserProtectedRoute(req)).toBe(false);
      });
    });
  });

  describe("getRoleBasedHomeRedirectURL", () => {
    it("should return admin home path for admin roles", () => {
      expect(getRoleBasedHomeRedirectURL("admin" as UserRole)).toBe(
        PATHS.admin.home
      );
    });

    it("should return admin home path for super_admin roles", () => {
      expect(getRoleBasedHomeRedirectURL("super_admin" as UserRole)).toBe(
        PATHS.admin.home
      );
    });

    it("should return default home path for non-admin roles", () => {
      expect(getRoleBasedHomeRedirectURL("user" as UserRole)).toBe(PATHS.home);
      expect(getRoleBasedHomeRedirectURL("alumni" as UserRole)).toBe(
        PATHS.home
      );
    });

    it("should return default home path for empty role", () => {
      expect(getRoleBasedHomeRedirectURL("" as UserRole)).toBe(PATHS.home);
    });

    it("should return default home path for non existing (invalid) role", () => {
      expect(getRoleBasedHomeRedirectURL("invalid_role" as UserRole)).toBe(
        PATHS.home
      );
    });
  });
});
