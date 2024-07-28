import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthController } from './controllers/userAuth.controller';
import { UserModule } from '../users/websiteUser/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKeyPaths, ISecurityConfig } from '~/config';
import { isDev } from '~/global/env';
import { AdminAuthController } from './controllers/adminAuth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/websiteUser/entities/user.entity';
import { DashboardUserEntity } from '../users/dashboardUser/entities/admin.entity';
import {
  JwtDashboardStrategy,
  JwtAdminStrategy,
} from './strategies/jwt.strategy';
import { RTJwtWebsiteStrategy } from './strategies/rt-jwt.strategy';
import { AdminModule } from '../users/dashboardUser/admin.module';
import { AuthStrategy } from './auth.constant';
import { PhoneValidationService } from '~/shared/services/ValidatePhone.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AdminModule),
    TypeOrmModule.forFeature([UserEntity, DashboardUserEntity]),
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
  ],
  exports: [AuthService],
})
export class AuthModule {}
