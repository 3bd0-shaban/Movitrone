import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

import { ConfigService } from '@nestjs/config';
import { UserJwtPayload } from '../auth';
import { ISecurityConfig, SecurityConfig } from 'src/config';

@Injectable()
export class RTJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    configService: ConfigService,
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
    // return this.authService.getAuthUser(payload.sub);
    return payload;
  }
}
