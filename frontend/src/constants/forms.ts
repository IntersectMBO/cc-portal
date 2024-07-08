import { PermissionsListObject, RoleListObject } from "@/lib/requests";
import { isAdminRole, isSuperAdminRole } from "@utils";

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
export const adminAddMemberRoleList: RoleListObject[] = [
  {
    label: "Constitutional member",
    value: "user",
  },
];

//Roles that super admin can append when creating new members through Admin Dashboard in application
export const superAdminAddMemberRoleList: RoleListObject[] = [
  {
    label: "Admin",
    value: "admin",
  },
  ...adminAddMemberRoleList,
];

//All roles available in application
export const rolesList: RoleListObject[] = [
  ...superAdminAddMemberRoleList,
  {
    label: "Super admin",
    value: "super_admin",
  },
  {
    label: "Alumni",
    value: "alumni",
  },
];

export const getRoleDropdownList = (userRole) => {
  if (isSuperAdminRole(userRole)) {
    return superAdminAddMemberRoleList;
  } else if (isAdminRole(userRole)) {
    return adminAddMemberRoleList;
  }
};

export const PROFILE_PICTURE_MAX_FILE_SIZE = 5;

export const PATTERNS = {
  hotAddress: /^[a-fA-F0-9]{56}$/,
};
