import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneValidationService } from '@common/services';
import { AuthModule } from '../auth/auth.module';

const userEntityModule = TypeOrmModule.forFeature([UserEntity]);
@Module({
  imports: [userEntityModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, PhoneValidationService],
  exports: [UserService],
})
export class UserModule {}
