import { PermissionEnum } from '../enums/permission.enum';
import { RoleEnum } from '../enums/role.enum';
import { IRole } from './role.interface';

export class SuperAdminRole implements IRole {
  getRole(): RoleEnum {
    return RoleEnum.SUPER_ADMIN;
  }
  managedBy(): PermissionEnum {
    return null;
  }
}

export class AdminRole implements IRole {
  getRole(): RoleEnum {
    return RoleEnum.ADMIN;
  }
  managedBy(): PermissionEnum {
    return PermissionEnum.MANAGE_ADMINS;
  }
}

export class UserRole implements IRole {
  getRole(): RoleEnum {
    return RoleEnum.USER;
  }
  managedBy(): PermissionEnum {
    return PermissionEnum.MANAGE_CC_MEMBERS;
  }
}
