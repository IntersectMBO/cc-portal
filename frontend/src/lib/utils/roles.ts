import { rolesList } from "@consts";
import { UserRole } from "@/lib/requests";

/**
 * Checks if the given role is an admin or super admin role.
 * @param role The role to check.
 * @returns True if the role is "super_admin" or "admin", otherwise false.
 */
export const isAnyAdminRole = (role: UserRole | undefined): boolean =>
  isSuperAdminRole(role) || isAdminRole(role);

/**
 * Checks if the given role is an admin role.
 * @param role The role to check.
 * @returns True if the role is "admin", otherwise false.
 */
export const isAdminRole = (role: UserRole | undefined): boolean =>
  role === "admin";

/**
 * Checks if the given role is a super admin role.
 * @param role The role to check.
 * @returns True if the role is "super_admin", otherwise false.
 */
export const isSuperAdminRole = (role: UserRole | undefined): boolean =>
  role === "super_admin";

/**
 * Checks if the given role is a user role.
 * @param role The role to check.
 * @returns True if the role is "user", otherwise false.
 */
export const isUserRole = (role: UserRole | undefined) => role === "user";

/**
 * Gets the display label for a given role.
 * @param role The role value.
 * @returns The display label for the role.
 */
export const getRoleDisplayValue = (role: UserRole) =>
  rolesList.find((roleListObject) => roleListObject.value === role).label;

/**
 * Formats a list of role values into their corresponding display labels.
 * @param roles The list of role values.
 * @returns The list of role display labels.
 */
export const formatRoleList = (roles: UserRole[]) =>
  roles.map((role) => getRoleDisplayValue(role));
