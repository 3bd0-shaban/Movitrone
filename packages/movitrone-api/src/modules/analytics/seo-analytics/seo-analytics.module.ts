import { Module } from '@nestjs/common';
import { SeoAnalyticsService } from './seo-analytics.service';
import { SeoAnalyticsController } from './seo-analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoAnalyticsEntity } from './entities/seo-analytics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeoAnalyticsEntity])],
  controllers: [SeoAnalyticsController],
  providers: [SeoAnalyticsService],
  exports: [SeoAnalyticsService],
})
export class SeoAnalyticsModule {}
