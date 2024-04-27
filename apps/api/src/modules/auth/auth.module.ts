import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PhoneValidationService } from '@common/services';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKeyPaths, ISecurityConfig } from 'src/config';
import { isDev } from 'src/global/env';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const { jwtSecret, jwtExprire } =
          configService.get<ISecurityConfig>('security');

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: `${jwtExprire}s`,
          },
          ignoreExpiration: isDev,
        };
      },

      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PhoneValidationService],
  exports: [AuthService],
})
export class AuthModule {}
