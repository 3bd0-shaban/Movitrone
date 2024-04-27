import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to fetch refresh_token from cookie in REST API context
 */
export const RTCookie = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.cookies['refresh_token'];
  },
);
