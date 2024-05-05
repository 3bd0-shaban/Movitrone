import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthStrategy } from '../auth.constant';

/**
 * Decorator to fetch get cookies from cookie in REST API context by cookies Name
 */
// export const CookiesByName = (cookieName?: string): ParameterDecorator =>
//   createParamDecorator((data: unknown, context: ExecutionContext) => {
//     const request = context.switchToHttp().getRequest();
//     const name = cookieName;

//     return request.cookies[name];
//   });

export const RTWebsiteCookie = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.cookies[AuthStrategy.RTCookies_WEBSITE];
  },
);

export const RTDashboardCookie = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.cookies[AuthStrategy.RTCookies_ADMIN];
  },
);
