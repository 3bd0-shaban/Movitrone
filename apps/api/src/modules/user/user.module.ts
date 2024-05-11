import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneValidationService } from '@common/services';
import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../log/log.module';
import { EmailService } from '~/shared/mailer/mailer.service';

const userEntityModule = TypeOrmModule.forFeature([UserEntity]);
@Module({
  imports: [userEntityModule, forwardRef(() => AuthModule), LogModule],
  controllers: [UserController],
  providers: [UserService, PhoneValidationService, EmailService],
  exports: [UserService],
})
export class UserModule {}
