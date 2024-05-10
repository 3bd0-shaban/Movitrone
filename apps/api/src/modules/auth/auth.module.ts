import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthController } from './controllers/userAuth.controller';
import { UserModule } from '../user/user.module';
import { PhoneValidationService } from '@common/services';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKeyPaths, ISecurityConfig } from 'src/config';
import { isDev } from 'src/global/env';
import { AdminAuthController } from './controllers/adminAuth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AdminEntity } from '../admin/entities/admin.entity';
import {
  JwtDashboardStrategy,
  JwtAdminStrategy,
} from './strategies/jwt.strategy';
import { RTJwtWebsiteStrategy } from './strategies/rt-jwt.strategy';
import { AdminModule } from '../admin/admin.module';
import { AuthStrategy } from './auth.constant';
import { MailerService } from 'src/shared/mailer/mailer.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AdminModule),
    TypeOrmModule.forFeature([UserEntity, AdminEntity]),
    PassportModule.register({
      defaultStrategy: AuthStrategy.JWT,
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const { jwtSecret, jwtExpire } =
          configService.get<ISecurityConfig>('security');

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: `${jwtExpire}s`,
          },
          ignoreExpiration: isDev,
        };
      },

      inject: [ConfigService],
    }),
  ],
  controllers: [UserAuthController, AdminAuthController],
  providers: [
    AuthService,
    PhoneValidationService,
    JwtDashboardStrategy,
    JwtAdminStrategy,
    RTJwtWebsiteStrategy,
    MailerService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
