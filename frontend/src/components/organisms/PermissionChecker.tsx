import { Permissions } from "@/lib/requests";
import React, { ReactNode } from "react";

interface PermissionCheckerProps {
  permissions: Permissions[];
  requiredPermission: Permissions;
  children: ReactNode;
}

// Component conditionally renders its children based on whether a user possesses a specified permission."
/**
 *
 * @param permissions Array of user's permission
 * @param requiredPermission The permission required to render children
 * @param children Render the children only if the user has the required permission
 * @returns
 */
const PermissionChecker: React.FC<PermissionCheckerProps> = ({
  permissions,
  requiredPermission,
  children,
}) => {
  const hasPermission = permissions.includes(requiredPermission);

  return <>{hasPermission && children}</>;
};

export default PermissionChecker;
