import { Module, forwardRef } from '@nestjs/common';
import { WebsiteUserService } from './user.service';
import { WebsiteUserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { LogModule } from '../../log/log.module';
import { EmailService } from '~/shared/mailer/mailer.service';
import { PhoneValidationService } from '~/shared/services/ValidatePhone.service';

const userEntityModule = TypeOrmModule.forFeature([UserEntity]);
@Module({
  imports: [userEntityModule, forwardRef(() => AuthModule), LogModule],
  controllers: [WebsiteUserController],
  providers: [WebsiteUserService, PhoneValidationService, EmailService],
  exports: [WebsiteUserService],
})
export class UserModule {}
