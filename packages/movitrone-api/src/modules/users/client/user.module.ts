import { Module, forwardRef } from '@nestjs/common';
import { ClientService } from './user.service';
import { ClientController } from './user.controller';
import { ClientEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { LogModule } from '../../log/log.module';
import { EmailService } from '~/shared/mailer/mailer.service';
import { PhoneValidationService } from '~/shared/services/ValidatePhone.service';

const userEntityModule = TypeOrmModule.forFeature([ClientEntity]);
@Module({
  imports: [userEntityModule, forwardRef(() => AuthModule), LogModule],
  controllers: [ClientController],
  providers: [ClientService, PhoneValidationService, EmailService],
  exports: [ClientService],
})
export class UserModule {}
