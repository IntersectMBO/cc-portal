import { UserRole } from "@/lib/requests";

export const isAdminRole = (role: UserRole | undefined): boolean =>
  role === "super_admin" || role === "admin";

export const isUserRole = (role: UserRole | undefined) => role === "user";
