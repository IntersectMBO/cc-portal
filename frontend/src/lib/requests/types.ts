export type UserRole = "super_admin" | "admin" | "user" | "alumni" | null;

export interface RoleListObject {
  value: UserRole;
  label: string;
}

export type Permissions = "manage_cc_members" | "add_constitution_version";

export interface PermissionsListObject {
  value: Permissions;
  label: string;
}

export interface DecodedToken {
  userId: string;
  email: string;
  role: UserRole;
  permissions: Permissions[];
  iat: number;
  exp: number;
}

export interface LoginResponse {
  success: boolean;
}

export type UserAuthStatus = "pending" | "active" | "inactive";

export interface FetchUserData {
  id: string;
  name: string | null;
  email: string;
  description: string | null;
  hot_addresses?: string | null;
  profile_photo_url: string | null;
  status: UserAuthStatus;
  role: UserRole;
  permissions: Permissions;
  created_at: Date;
  updated_at: Date;
}
