import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserJwtPayload } from '../auth';
import { AuthService } from '../auth.service';
import { ISecurityConfig, SecurityConfig } from '~/config';
import { AuthStrategy } from '../auth.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategy.JWT) {
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
    // This is called to validate the user in the token exists
    console.log(payload);
    return this.authService.getAuthUser(payload.sub);
  }
}
