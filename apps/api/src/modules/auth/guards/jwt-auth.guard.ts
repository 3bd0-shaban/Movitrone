import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../auth.constant';

@Injectable()
export class JwtUserGuard extends AuthGuard(AuthStrategy.JWT) {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request;
  }

  errorHandler(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('Unauthorized: Invalid or expired token');
    }
    return user;
  }
}

@Injectable()
export class JwtAdminGuard extends AuthGuard(AuthStrategy.ADMIN_JWT) {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request;
  }

  errorHandler(err: any, user: any, info: any, context: ExecutionContext) {
    // If authentication fails, replace the UnauthorizedException with a custom error message
    if (err || !user) {
      throw new UnauthorizedException('Unauthorized: Invalid or expired token');
    }
    return user;
  }
}
