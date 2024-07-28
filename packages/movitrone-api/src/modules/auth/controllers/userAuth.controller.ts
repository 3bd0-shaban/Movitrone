import { Controller, Post, Body, Inject, Res, Get } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from '~/shared/dto/inputs/create-user.dto';
import { SignInDto } from '../dto/SignIn.dto';
import { ISecurityConfig, SecurityConfig } from '~/config';
import { Response } from 'express';
import { AuthStrategy, REFRESH_TOKEN_DURATION } from '../auth.constant';
import { RefreshREsult } from '../auth';
import { RTWebsiteCookie } from '../decorator/http-Cookies.decorator';
import { addDurationFromNow } from '~/shared/utilities/date-time.utils';
import { VerifyOTPDTOs } from '~/modules/users/websiteUser/dto/verify-otp.dto';
import { CurrentUser } from '../decorator/auth-user.decorator';
import { UserEntity } from '~/modules/users/websiteUser/entities/user.entity';
import { WebsiteUserService } from '~/modules/users/websiteUser/user.service';

@ApiTags('Authentication - Website')
@Controller('auth')
export class UserAuthController {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private readonly authService: AuthService,
    private readonly userService: WebsiteUserService,
  ) {}

  @Post('register')
  async Signup(@Body() createUserDTO: CreateUserDTO) {
    return await this.userService.create(createUserDTO);
  }
  @Post('verify')
  async Verify(@Body() inputs: VerifyOTPDTOs, @CurrentUser() user: UserEntity) {
    return await this.userService.VerifyOTP(user.id, inputs);
  }

  @Post('signin')
  async Signin(@Body() inputs: SignInDto, @Res() res: Response) {
    const user = await this.authService.ValidateWebsiteUser(inputs);
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
      'refresh_token',
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
    @RTWebsiteCookie() refresh_token: string,
  ): Promise<RefreshREsult> {
    return this.authService.refreshToken(refresh_token);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie(AuthStrategy.RTCookies_WEBSITE);
    return res.status(200).send();
  }
}
