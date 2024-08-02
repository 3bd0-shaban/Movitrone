import { Module, forwardRef } from '@nestjs/common';
import { ClientService } from './user.service';
import { ClientController } from './controllers/user.controller';
import { ClientEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { LogModule } from '../../log/log.module';
import { EmailService } from '~/shared/mailer/mailer.service';
import { PhoneValidationService } from '~/shared/services/ValidatePhone.service';
import { ClientAdminController } from './controllers/user-admin.controller';

const userEntityModule = TypeOrmModule.forFeature([ClientEntity]);
@Module({
  imports: [userEntityModule, forwardRef(() => AuthModule), LogModule],
  controllers: [ClientController, ClientAdminController],
  providers: [ClientService, PhoneValidationService, EmailService],
  exports: [ClientService],
})
export class UserModule {}
