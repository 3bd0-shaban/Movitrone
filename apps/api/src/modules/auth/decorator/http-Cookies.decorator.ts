import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to fetch get cookies from cookie in REST API context by cookies Name
 */
export const HttpCookies = (cookieName?: string): ParameterDecorator =>
  createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const name = cookieName;
    return request.cookies[name];
  });
