import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchPermissions(permissions, user.permissions);
  }

  matchPermissions(requiredPermissions: string[], userPermissions: string[]) {
    const result = requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
    return result;
  }
}
