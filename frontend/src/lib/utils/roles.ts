import { rolesList } from "@/constants/forms";
import { UserRole } from "@/lib/requests";

/**
 * This function evaluates if the provided role is one of the following:
 * - "super_admin"
 * - "admin"
 *
 * @param role - The role to check.
 * @returns `true` if the role is "super_admin" or "admin"; `false` otherwise.
 *
 * @example
 * // Example usage
 * isAnyAdminRole("admin"); // true
 * isAnyAdminRole("user"); // false
 */
export const isAnyAdminRole = (role: UserRole | undefined): boolean =>
  isSuperAdminRole(role) || isAdminRole(role);

/**
 * This function determines if the provided role is "admin".
 *
 * @param role - The role to check.
 * @returns `true` if the role is "admin"; `false` otherwise.
 *
 * @example
 * // Example usage
 * isAdminRole("admin"); // true
 * isAdminRole("super_admin"); // false
 */
export const isAdminRole = (role: UserRole | undefined): boolean =>
  role === "admin";

/**
 * This function determines if the provided role is "super_admin".
 *
 * @param role - The role to check.
 * @returns `true` if the role is "super_admin"; `false` otherwise.
 *
 * @example
 * // Example usage
 * isSuperAdminRole("super_admin"); // true
 * isSuperAdminRole("user"); // false
 */
export const isSuperAdminRole = (role: UserRole | undefined): boolean =>
  role === "super_admin";

/**
 * This function determines if the provided role is "user".
 *
 * @param role - The role to check.
 * @returns `true` if the role is "user"; `false` otherwise.
 *
 * @example
 * // Example usage
 * isUserRole("user"); // true
 * isUserRole("admin"); // false
 */
export const isUserRole = (role: UserRole | undefined) => role === "user";

/**
 * Retrieves the display label for a given role from the roles list.
 *
 * This function searches the `rolesList` for an object with a `value` matching the provided role
 * and returns the associated `label`.
 *
 * @param role - The role value for which to get the display label.
 * @returns The display label for the role.
 *
 * @example
 * // Example usage
 * getRoleDisplayValue("admin"); // returns the label for "admin" in roleList array
 */
export const getRoleDisplayValue = (role: UserRole) =>
  rolesList.find((roleListObject) => roleListObject.value === role).label;

/**
 * Formats a list of role values into their corresponding display labels.
 *
 * This function maps each role in the provided list to its display label using the `getRoleDisplayValue` function.
 *
 * @param roles - The list of role values to format.
 * @returns An array of display labels corresponding to the provided roles.
 *
 * @example
 * // Example usage
 * formatRoleList(["admin", "user"]); // returns an array of labels for "admin" and "user"
 */
export const formatRoleList = (roles: UserRole[]) =>
  roles.map((role) => getRoleDisplayValue(role));

/**
 * Checks if the current user has permission to manage the specified user role.
 *
 * This function determines if the current user has the necessary permissions to manage the specified role.
 * It checks if the user permissions include "manage_admins" for admin roles or "manage_cc_members" for user roles.
 *
 * @param roleToManage - The role of the user to be managed.
 * @param userPermissions - An array of permissions associated with the current user.
 * @returns `true` if the user has the necessary permission; `false` otherwise.
 *
 * @example
 * // Example usage
 * hasManageUserPermission("admin", ["manage_admins"]); // true
 * hasManageUserPermission("user", ["manage_admins"]); // false
 * hasManageUserPermission("admin", ["add_constitution_version"]); // false
 */
export const hasManageUserPermission = (
  roleToManage: UserRole | undefined,
  userPermissions: string[]
): boolean => {
  if (isAnyAdminRole(roleToManage)) {
    return userPermissions.includes("manage_admins");
  } else if (isUserRole(roleToManage)) {
    return userPermissions.includes("manage_cc_members");
  }
  return false;
};
