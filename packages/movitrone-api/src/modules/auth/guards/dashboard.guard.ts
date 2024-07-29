import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminEntity } from '~/modules/users/admin/entities/admin.entity';

@Injectable()
export class DashboardGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user) {
      const user = request.user as AdminEntity;
      if (user.role === 'Admin' || user.role === 'Super Admin') {
        return true;
      }
    }
    throw new UnauthorizedException(
      'Could not authenticate dashboard with token or user does not have permissions',
    );
  }
}
