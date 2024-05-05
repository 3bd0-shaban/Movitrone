import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Res,
  Inject,
} from '@nestjs/common';
import { SignInDto } from './dto/SignIn.dto';
import * as bcrypt from 'bcrypt';
import { PhoneValidationService } from '@common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { Response } from 'express';
import { RefreshREsult, UserJwtPayload } from './auth';
import { AdminEntity } from '../admin/entities/admin.entity';
import { JwtService } from '@nestjs/jwt';
import { ISecurityConfig, SecurityConfig } from 'src/config';
import { addDurationFromNow } from '@common/utilities';
import { ACCESS_TOKEN_DURATION } from './auth.constant';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private phoneValidationService: PhoneValidationService,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  /**
   * sign in for users by website
   *
   * @param {SignInDto} inputs - sign in inputs dtos
   * @returns {Promise<{ id: number; email: string }>} - Result ( ID, email ) of admin
   * @memberof AuthService
   */
  async ValidateWebsiteUser(
    inputs: SignInDto,
  ): Promise<{ id: number; email: string }> {
    const { email, password } = inputs;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.password'])
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException(ErrorEnum.USER_NOT_FOUND);
    }

    const isMatch = await this.comparePassword(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException(ErrorEnum.INVALID_EMAIL_PASSWORD);
    }

    return { id: user.id, email: user.email };
  }

  /**
   * sign in for admins by dashboard
   *
   * @param {SignInDto} inputs - sign in inputs dtos
   * @returns {Promise<{ id: number; email: string }>} - Result ( ID, email ) of admin
   * @memberof AuthService
   */
  async ValidateAdminUser(
    inputs: SignInDto,
  ): Promise<{ id: number; email: string }> {
    const { email, password } = inputs;

    const user = await this.adminRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.password'])
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException(ErrorEnum.USER_NOT_FOUND);
    }

    const isMatch = await this.comparePassword(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException(ErrorEnum.INVALID_EMAIL_PASSWORD);
    }

    return { id: user.id, email: user.email };
  }

  /**
   * get user who is authenticated
   *
   * @param {number} id - user ID
   * @returns {Promise<UserEntity>} - Result UserEntity
   * @memberof AuthService
   */
  async getAuthUser(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    if (user) {
      return user;
    }

    throw new NotFoundException(
      'No authentication user founded, please logging in first',
    );
  }

  /**
   * get admin who is authenticated
   *
   * @param {number} id - user ID
   * @returns {Promise<AdminEntity>} - Result Admin Entity
   * @memberof AuthService
   */
  async getAuthAdmin(id: number): Promise<AdminEntity> {
    const user = await this.adminRepository.findOneBy({ id });

    if (user) {
      return user;
    }

    throw new NotFoundException(
      'No authentication admin founded, please logging in first',
    );
  }

  /**
   * Refresh the access token using the provided refresh token
   *
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<RefreshREsult>} - Result containing the new access token and its expiration date
   * @memberof AuthService
   */
  async refreshToken(refreshToken: string): Promise<RefreshREsult> {
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Could not log-in with the provided credentials',
      );
    }

    const payload = await this.VerifyToken(
      this.securityConfig.refreshSecret,
      refreshToken,
    );

    if (!payload) {
      throw new UnauthorizedException(
        'Could not log-in with the provided credentials',
      );
    }

    const jwtPayload: UserJwtPayload = { sub: payload.sub };
    const access_token = await this.generateToken(
      this.securityConfig.refreshSecret,
      '15m',
      jwtPayload,
    );

    return {
      access_token: access_token,
      expires_at: addDurationFromNow(ACCESS_TOKEN_DURATION),
    };
  }

  /**
   * Set refresh token in cookies
   *
   * @param {Response} res - Express response object
   * @param {string} refreshToken - Refresh token
   * @param {string} cookiesName - access token
   * @param {number} expiresInMilliseconds - Token expiration time in milliseconds
   * @memberof AuthService
   */
  async setRefreshTokenCookie(
    @Res() res: Response,
    cookiesName: string,
    refreshToken: string,
    expiresInMilliseconds: number,
  ) {
    res.cookie(cookiesName, refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: expiresInMilliseconds,
      sameSite: 'none',
      path: '/',
    });
  }

  /**
   * Generate a token for authentication
   *
   * @param {string} secretKey - Secret key used to sign the token
   * @param {string} expireIn - Expiration time of the token (e.g., '1d' for 1 day)
   * @param {UserJwtPayload} payload - JWT payload
   * @returns {Promise<string>} - Generated JWT token
   * @memberof AuthService
   */
  async generateToken(
    secretKey: string,
    expireIn: string,
    payload: UserJwtPayload,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: secretKey,
      expiresIn: expireIn,
    });
  }

  /**
   * Verify the provided token
   *
   * @param {string} secretKey secret key from env
   * @param {string} token - Token to verify
   * @returns {Promise<UserJwtPayload>} - Decoded JWT payload
   * @memberof AuthService
   */
  async VerifyToken(secretKey: string, token: string): Promise<UserJwtPayload> {
    return await this.jwtService.verifyAsync(token, { secret: secretKey });
  }

  /**
   * Compare entered and database passwords
   *
   * @param {string} enteredPassword - Entered password
   * @param {string} dbPassword - Database password
   * @returns {Promise<boolean>} - Password match result
   * @memberof AuthService
   */
  async comparePassword(
    enteredPassword: string,
    dbPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }

  /**
   * Hash the provided password
   *
   * @param {string} password - Password to hash
   * @returns {Promise<string>} - Hashed password
   * @memberof AuthService
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  /**
   * validate phone number by libphone liberery from google
   *
   * @param {{number: string;code: string}} phone -phone number ( code , number )
   * @returns {Promise<string>} - formatted phone number
   * @memberof AuthService
   */
  validateAndFormatPhoneNumber(phone: {
    number: string;
    code: string;
  }): string {
    return this.phoneValidationService.validatePhoneNumber(phone);
  }
}
