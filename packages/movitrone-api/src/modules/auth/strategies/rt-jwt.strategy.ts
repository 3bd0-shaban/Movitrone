import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { UserJwtPayload } from '../auth';
import { ISecurityConfig, SecurityConfig } from '~/config';
import { AuthStrategy } from '../auth.constant';
import { WebsiteUserService } from '~/modules/users/websiteUser/user.service';
import { DashboardUserService } from '~/modules/users/dashboardUser/admin.service';

@Injectable()
export class RTJwtWebsiteStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.REFRESH_JWT_WEBSITE,
) {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private userService: WebsiteUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const RTCookie = request.cookies['refresh_token'];
          if (!RTCookie) {
            throw new ForbiddenException(
              'No refresh token founded, log in required',
            );
          }
          return RTCookie;
        },
      ]),
      secretOrKey: securityConfig.jwtSecret,
    });
  }

  async validate(payload: UserJwtPayload) {
    return this.userService.findOne(payload.sub);
  }
}

@Injectable()
export class RTJwtDashboardStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.REFRESH_JWT_Dashboard,
) {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private adminService: DashboardUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const RTCookie = request.cookies[AuthStrategy.RTCookies_ADMIN];
          if (!RTCookie) {
            throw new ForbiddenException(
              'No admin refresh token founded, log in required',
            );
          }
          return RTCookie;
        },
      ]),
      secretOrKey: securityConfig.jwtSecret,
    });
  }

  async validate(payload: UserJwtPayload) {
    return this.adminService.findOne(payload.sub);
  }
}
