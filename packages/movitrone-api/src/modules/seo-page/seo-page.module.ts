import { Module, forwardRef } from '@nestjs/common';
import { SeoPageService } from './seo-page.service';
import { SeoPageController } from './seo-page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogModule } from '../log/log.module';
import { SeoAnalyticsModule } from '../analytics/seo-analytics/seo-analytics.module';
import { SeoPageEntity } from './entities/seo-page.entity';
import { SeoCountryModule } from '../seo-country/seo-country.module';

@Module({
  imports: [
    LogModule,
    SeoAnalyticsModule,
    forwardRef(() => SeoCountryModule),
    TypeOrmModule.forFeature([SeoPageEntity]),
  ],
  controllers: [SeoPageController],
  providers: [SeoPageService],
  exports: [SeoPageService],
})
export class SeoPageModule {}
