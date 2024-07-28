import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { SseService } from '~/modules/sse/sse.service';

import { RoleModule } from '../role/role.module';

import { MenuController } from './menu.controller';
import { MenuEntity } from './entity/menu.entity';
import { MenuService } from './menu.service';

const providers = [MenuService];

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuEntity]),

    forwardRef(() => RoleModule),
  ],
  controllers: [MenuController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class MenuModule {}
