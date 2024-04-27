import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../auth.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategy.JWT) {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If authentication fails, replace the UnauthorizedException with a custom error message
    if (err || !user) {
      throw new UnauthorizedException('Unauthorized: Invalid or expired token');
    }
    return user;
  }
}
