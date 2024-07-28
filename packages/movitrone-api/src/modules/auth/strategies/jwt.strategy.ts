import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserJwtPayload } from '../auth';
import { ISecurityConfig, SecurityConfig } from '~/config';
import { AuthStrategy } from '../auth.constant';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.JWT,
) {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: securityConfig.jwtSecret,
    });
  }

  async validate(payload: UserJwtPayload) {
    return this.authService.getAuthUser(payload.sub);
  }
}

@Injectable()
export class JwtDashboardStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.ADMIN_JWT,
) {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: securityConfig.jwtSecret,
    });
  }

  async validate(payload: UserJwtPayload) {
    return this.authService.getAuthAdmin(payload.sub);
  }
}
