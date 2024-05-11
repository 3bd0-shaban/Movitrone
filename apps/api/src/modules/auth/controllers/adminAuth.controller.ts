import { Controller, Post, Body, Res, Inject, Get } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../dto/SignIn.dto';
import { ISecurityConfig, SecurityConfig } from '~/config';
import { AuthStrategy, REFRESH_TOKEN_DURATION } from '../auth.constant';
import { addDurationFromNow } from '~/shared/utilities/date-time.utils';
import { Response } from 'express';
import { RefreshREsult } from '../auth';
import { RTDashboardCookie } from '../decorator/http-Cookies.decorator';
import { AdminService } from '~/modules/admin/admin.service';
import { CreateAdminDto } from '~/modules/admin/dto/create-admin.dto';

@ApiTags('Authentication - Dashboard')
@Controller('auth-admin')
export class AdminAuthController {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
  ) {}

  @Post('register')
  async Signup(@Body() createUserDTO: CreateAdminDto) {
    return this.adminService.create(createUserDTO);
  }

  @Post('signin')
  async Signin(@Body() inputs: SignInDto, @Res() res: Response) {
    const user = await this.authService.ValidateAdminUser(inputs);
    const jwtPayload = {
      sub: user.id,
    };
    const access_token = await this.authService.generateToken(
      this.securityConfig.jwtSecret,
      '15m',
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
      session_expireIn: addDurationFromNow(REFRESH_TOKEN_DURATION),
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
