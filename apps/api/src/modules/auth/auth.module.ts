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
import { JwtStrategy } from './strategies/jwt.strategy';
import { RTJwtStrategy } from './strategies/rt-jwt.strategy';

const userEntityModule = TypeOrmModule.forFeature([UserEntity]);
const adminEntityModule = TypeOrmModule.forFeature([AdminEntity]);

@Module({
  imports: [
    userEntityModule,
    adminEntityModule,
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
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
  providers: [AuthService, PhoneValidationService, JwtStrategy, RTJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
