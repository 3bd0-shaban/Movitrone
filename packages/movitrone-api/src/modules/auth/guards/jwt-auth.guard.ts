import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy, PUBLIC_KEY } from '../auth.constant';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtUserGuard extends AuthGuard(AuthStrategy.JWT) {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Allow access to public routes
    }

    // If not public, use the default AuthGuard logic
    return super.canActivate(context) as boolean;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('Unauthorized: Invalid or expired token');
    }
    return user;
  }
}

@Injectable()
export class JwtAdminGuard extends AuthGuard(AuthStrategy.ADMIN_JWT) {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Allow access to public routes
    }

    // If not public, use the default AuthGuard logic
    return super.canActivate(context) as boolean;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If authentication fails, replace the UnauthorizedException with a custom error message
    if (err || !user) {
      throw new UnauthorizedException('Unauthorized: Invalid or expired token');
    }
    return user;
  }
}
