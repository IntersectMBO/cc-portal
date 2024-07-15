import { PermissionEnum } from '../enums/permission.enum';
import { RoleEnum } from '../enums/role.enum';

export interface IRole {
  getRole(): RoleEnum;
  managedBy(): PermissionEnum;
}
