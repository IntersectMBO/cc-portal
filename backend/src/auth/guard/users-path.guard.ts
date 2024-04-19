import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestWithUser } from 'src/common/interfaces/request.interface';

@Injectable()
export class UserPathGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const idFromPath = request.params.id;
    const userId = request.user?.userId;

    if (idFromPath !== userId) {
      throw new UnauthorizedException(
        'Id from path does not match id from token.',
      );
    }
    return true;
  }
}
