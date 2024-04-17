import { PermissionsListObject, RoleListObject } from "@/lib/requests";

/**
 * Array containing objects representing different permissions available in the system.
 * Each object has a label describing the permission and a corresponding value representing the permission code.
 */
export const permissionsList: PermissionsListObject[] = [
  {
    label: "Manage constitutional members",
    value: "manage_cc_members",
  },
  {
    label: "Upload Constitution version",
    value: "add_constitution_version",
  },
];

//Roles that admin can append when creating new members through Admin Dashboard in application
export const addMemberRoleList: RoleListObject[] = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Constitutional member",
    value: "user",
  },
];

//All roles available in application
export const rolesList: RoleListObject[] = [
  ...addMemberRoleList,
  {
    label: "Super admin",
    value: "super_admin",
  },
  {
    label: "Alumni",
    value: "alumni",
  },
];
