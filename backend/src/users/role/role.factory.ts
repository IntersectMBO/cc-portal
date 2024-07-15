import { Injectable } from '@nestjs/common';
import { SuperAdminRole } from './role.impl';
import { AdminRole } from './role.impl';
import { UserRole } from './role.impl';
import { IRole } from './role.interface';
import { RoleEnum } from '../enums/role.enum';

@Injectable()
export class RoleFactory {
  constructor(
    private readonly superAdminRole: SuperAdminRole,
    private readonly adminRole: AdminRole,
    private readonly userRole: UserRole,
  ) {}

  getInstance(code: string): IRole {
    switch (code) {
      case RoleEnum.SUPER_ADMIN:
        return this.superAdminRole;
      case RoleEnum.ADMIN:
        return this.adminRole;
      case RoleEnum.USER:
        return this.userRole;
      default:
        throw new Error(`Role for code ${code} not found`);
    }
  }
}
