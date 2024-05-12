import { Module } from '@nestjs/common';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoEntity } from './entities/seo.entity';
import { LogModule } from '../log/log.module';
import { SeoAnalyticsModule } from '../analytics/seo-analytics/seo-analytics.module';

@Module({
  imports: [
    LogModule,
    SeoAnalyticsModule,
    TypeOrmModule.forFeature([SeoEntity]),
  ],
  controllers: [SeoController],
  providers: [SeoService],
})
export class SeoModule {}
