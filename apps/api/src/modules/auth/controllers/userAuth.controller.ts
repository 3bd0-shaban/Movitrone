import { Controller, Post, Body, Inject, Res, Get } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../../user/user.service';
import { CreateUserDTO } from '~/shared/dto/create-user.dto';
import { SignInDto } from '../dto/SignIn.dto';
import { ISecurityConfig, SecurityConfig } from '~/config';
import { Response } from 'express';
import { AuthStrategy, REFRESH_TOKEN_DURATION } from '../auth.constant';
import { RefreshREsult } from '../auth';
import { RTWebsiteCookie } from '../decorator/http-Cookies.decorator';
import { addDurationFromNow } from '@common/utilities';
import { MailerService } from '~/shared/mailer/mailer.service';

@ApiTags('Authentication - Website')
@Controller('auth')
export class UserAuthController {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('register')
  async Signup(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.create(createUserDTO);
    this.mailerService.sendVerificationCode(user.email);
    return user;
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
