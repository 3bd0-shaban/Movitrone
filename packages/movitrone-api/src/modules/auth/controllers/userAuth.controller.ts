import {
  Controller,
  Post,
  Body,
  Inject,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from '~/shared/dto/inputs/create-user.dto';
import { SignInDto } from '../dto/SignIn.dto';
import { ISecurityConfig, SecurityConfig } from '~/config';
import { Response } from 'express';
import {
  ACCESS_TOKEN_DURATION,
  AuthStrategy,
  REFRESH_TOKEN_DURATION,
} from '../auth.constant';
import { RefreshREsult } from '../auth';
import { RTWebsiteCookie } from '../decorator/http-Cookies.decorator';
import { addDurationFromNow } from '~/shared/utilities/date-time.utils';
import { VerifyOTPDTOs } from '~/modules/users/client/dto/verify-otp.dto';
import { CurrentUser } from '../decorator/auth-user.decorator';
import { ClientService } from '~/modules/users/client/user.service';
import { isDev } from '~/global/env';
import { ClientEntity } from '~/modules/users/client/entities/user.entity';
import { JwtUserGuard } from '../guards/jwt-auth.guard';

@ApiTags('Authentication - Website')
@Controller('auth')
export class UserAuthController {
  constructor(
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    private readonly authService: AuthService,
    private readonly userService: ClientService,
  ) {}

  @Post('register')
  @ApiBearerAuth('public')
  async Signup(@Body() createUserDTO: CreateUserDTO) {
    return await this.userService.create(createUserDTO);
  }
  @Post('verify')
  @UseGuards(JwtUserGuard)
  async Verify(
    @Body() inputs: VerifyOTPDTOs,
    @CurrentUser() user: ClientEntity,
  ) {
    return await this.userService.VerifyOTP(user.id, inputs);
  }

  @Post('signin')
  @ApiBearerAuth('public')
  async Signin(@Body() inputs: SignInDto, @Res() res: Response) {
    const user = await this.authService.ValidateWebsiteUser(inputs);
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
      'refresh_token',
      refreshToken,
      REFRESH_TOKEN_DURATION,
    );
    res.send({
      access_token,
      expires_at: addDurationFromNow(
        isDev ? 7 * 24 * 60 * 60 * 1000 : ACCESS_TOKEN_DURATION,
      ),
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
