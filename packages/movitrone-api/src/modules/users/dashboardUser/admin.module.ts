import { Module, forwardRef } from '@nestjs/common';
import { DashboardUserService } from './admin.service';
import { DashboardUserController } from './admin.controller';
import { AuthModule } from '../../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardUserEntity } from './entities/admin.entity';
import { LogModule } from '../../log/log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DashboardUserEntity]),
    forwardRef(() => AuthModule),
    LogModule,
  ],
  controllers: [DashboardUserController],
  providers: [DashboardUserService],
  exports: [DashboardUserService],
})
export class AdminModule {}
