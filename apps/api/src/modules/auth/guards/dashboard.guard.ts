import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Admin } from 'src/modules/admin/entities/admin.entity';

@Injectable()
export class DashboardGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    if (request.user) {
      const user = <Admin>request.user;
      if (
        user.role === 'Admin' ||
        user.role === 'Operation' ||
        user.role === 'Sales'
      )
        return true;
    }
    throw new UnauthorizedException(
      'Could not authenticate dashboard with token or user does not have permissions',
    );
  }
}
