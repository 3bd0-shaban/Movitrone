import { Controller, Post, Body, Res, Inject, Get } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../dto/SignIn.dto';
import { ISecurityConfig, SecurityConfig } from '~/config';
import {
  ACCESS_TOKEN_DURATION,
  AuthStrategy,
  REFRESH_TOKEN_DURATION,
} from '../auth.constant';
import { addDurationFromNow } from '~/shared/utilities/date-time.utils';
import { Response } from 'express';
import { RefreshREsult } from '../auth';
import { RTDashboardCookie } from '../decorator/http-Cookies.decorator';
import { AdminService } from '~/modules/users/admin/admin.service';
import { CreateAdminDto } from '~/modules/users/admin/dto/create-admin.dto';
import { isDev } from '~/global/env';

@ApiTags('Authentication - Dashboard')
@Controller('auth-admin')
export class AdminAuthController {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
  ) {}

  @Post('register')
  @ApiBearerAuth('public')
  async Signup(@Body() createUserDTO: CreateAdminDto) {
    return this.adminService.create(createUserDTO);
  }

  @Post('signin')
  @ApiBearerAuth('public')
  async Signin(@Body() inputs: SignInDto, @Res() res: Response) {
    const user = await this.authService.ValidateAdminUser(inputs);
    const jwtPayload = {
      sub: user.id,
    };
    const access_token = await this.authService.generateToken(
      this.securityConfig.jwtSecret,
      isDev ? '7d' : '15m',
      jwtPayload,
    );
    const refreshToken = await this.authService.generateToken(
      this.securityConfig.refreshSecret,
      '7d',
      jwtPayload,
    );
    this.authService.setRefreshTokenCookie(
      res,
      AuthStrategy.RTCookies_ADMIN,
      refreshToken,
      REFRESH_TOKEN_DURATION,
    );
    res.send({
      access_token,
      expires_at: addDurationFromNow(
        isDev ? 7 * 24 * 60 * 60 * 1000 : ACCESS_TOKEN_DURATION,
      ),
      role: user.role,
    });
  }

  @Get('refreshToken')
  async refreshToken(
    @RTDashboardCookie() refresh_token: string,
  ): Promise<RefreshREsult> {
    return this.authService.refreshToken(refresh_token);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie(AuthStrategy.RTCookies_ADMIN);
    return res.status(200).send();
  }
}
