import { Module, forwardRef } from '@nestjs/common';
import { SeoCountryService } from './seo-country.service';
import { SeoCountryController } from './seo-country.controller';
import { SeoPageModule } from '../seo-page/seo-page.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoCountryEntity } from './entities/seo-country.entity';
import { LogModule } from '../../log/log.module';
import { SeoAnalyticsModule } from '../../analytics/seo-analytics/seo-analytics.module';

@Module({
  imports: [
    LogModule,
    SeoAnalyticsModule,
    forwardRef(() => SeoPageModule),
    TypeOrmModule.forFeature([SeoCountryEntity]),
  ],
  controllers: [SeoCountryController],
  providers: [SeoCountryService],
  exports: [SeoCountryService],
})
export class SeoCountryModule {}
