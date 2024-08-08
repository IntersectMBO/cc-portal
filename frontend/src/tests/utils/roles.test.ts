import {
  isAnyAdminRole,
  isAdminRole,
  isSuperAdminRole,
  isUserRole,
  getRoleDisplayValue,
  formatRoleList,
  hasManageUserPermission,
} from "../../lib/utils/roles";

describe("Role Functions", () => {
  // Testing isAnyAdminRole function
  describe("isAnyAdminRole", () => {
    it('should return true for "admin" role', () => {
      expect(isAnyAdminRole("admin")).toBe(true);
    });

    it('should return true for "super_admin" role', () => {
      expect(isAnyAdminRole("super_admin")).toBe(true);
    });

    it('should return false for "user" role', () => {
      expect(isAnyAdminRole("user")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(isAnyAdminRole(undefined)).toBe(false);
    });
  });

  // Testing isAdminRole function
  describe("isAdminRole", () => {
    it('should return true for "admin" role', () => {
      expect(isAdminRole("admin")).toBe(true);
    });

    it('should return false for "super_admin" role', () => {
      expect(isAdminRole("super_admin")).toBe(false);
    });

    it('should return false for "user" role', () => {
      expect(isAdminRole("user")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(isAdminRole(undefined)).toBe(false);
    });
  });

  // Testing isSuperAdminRole function
  describe("isSuperAdminRole", () => {
    it('should return true for "super_admin" role', () => {
      expect(isSuperAdminRole("super_admin")).toBe(true);
    });

    it('should return false for "admin" role', () => {
      expect(isSuperAdminRole("admin")).toBe(false);
    });

    it('should return false for "user" role', () => {
      expect(isSuperAdminRole("user")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(isSuperAdminRole(undefined)).toBe(false);
    });
  });

  // Testing isUserRole function
  describe("isUserRole", () => {
    it('should return true for "user" role', () => {
      expect(isUserRole("user")).toBe(true);
    });

    it('should return false for "admin" role', () => {
      expect(isUserRole("admin")).toBe(false);
    });

    it('should return false for "super_admin" role', () => {
      expect(isUserRole("super_admin")).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(isUserRole(undefined)).toBe(false);
    });
  });

  // Testing getRoleDisplayValue function
  describe("getRoleDisplayValue", () => {
    it("should return the display label for a valid role", () => {
      expect(getRoleDisplayValue("super_admin")).toBe("Super admin");
      expect(getRoleDisplayValue("admin")).toBe("Admin");
      expect(getRoleDisplayValue("user")).toBe("Constitutional member");
      expect(getRoleDisplayValue("alumni")).toBe("Alumni");
    });
  });

  // Testing formatRoleList function
  describe("formatRoleList", () => {
    it("should return an array of display labels for valid roles", () => {
      expect(formatRoleList(["super_admin", "alumni"])).toEqual([
        "Super admin",
        "Alumni",
      ]);
      expect(
        formatRoleList(["super_admin", "alumni", "user", "admin"])
      ).toEqual(["Super admin", "Alumni", "Constitutional member", "Admin"]);
    });
  });

  // Testing hasManageUserPermission function
  describe("hasManageUserPermission", () => {
    it("should return true if user can manage admins", () => {
      expect(hasManageUserPermission("admin", ["manage_admins"])).toBe(true);
    });

    it("should return true if user can manage CC members", () => {
      expect(hasManageUserPermission("user", ["manage_cc_members"])).toBe(true);
    });

    it("should return false if user does not have permission to manage admins", () => {
      expect(hasManageUserPermission("admin", [])).toBe(false);
    });

    it("should return false if user does not have permission to manage CC members", () => {
      expect(hasManageUserPermission("user", [])).toBe(false);
    });

    it("should return false if user has other permissions, but not to manage CC members", () => {
      expect(
        hasManageUserPermission("user", ["add_constitution_version"])
      ).toBe(false);
    });

    it("should return false if admin has other permissions, but not to manage CC members", () => {
      expect(
        hasManageUserPermission("admin", ["add_constitution_version"])
      ).toBe(false);
    });

    it("should return false for undefined role", () => {
      expect(hasManageUserPermission(undefined, ["manage_admins"])).toBe(false);
    });
  });
});
