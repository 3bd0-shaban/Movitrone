import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  CanActivate,
} from '@nestjs/common';
import { Request } from 'express';
import { envBoolean } from '~/global/env';

/** Check if it's a demo environment. If it is, deny the operation */
export function checkIsDemoMode() {
  if (envBoolean('IS_DEMO')) {
    throw new ForbiddenException('Operation not allowed in demo mode');
  }
}

@Injectable()
export class CheckDemoGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Prevent users from performing create, update, or delete operations in demo mode
    if (request.method !== 'GET' && !request.url.includes('signin')) {
      checkIsDemoMode();
    }

    return true;
  }
}
