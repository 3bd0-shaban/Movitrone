import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SeoAnalyticsService } from './seo-analytics.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TimeRangeArgs } from './dto/args/timeRange-query.args';
import { PageTimeQueryDto } from './dto/args/page-time-query.args';
import {
  IAllPageViews,
  ICountriesViewsByPagePerDay,
  IPageViewsPerDay,
} from './seo-analytics';
import { AdminGuard } from '~/modules/auth/guards/admin.guard';
import { JwtUserGuard } from '~/modules/auth/guards/jwt-auth.guard';

@ApiTags('Seo Analytics')
@ApiBearerAuth()
@Controller('seo-analytics')
export class SeoAnalyticsController {
  constructor(private readonly seoAnalyticsService: SeoAnalyticsService) {}

  @Get('all-pages-views')
  @UseGuards(JwtUserGuard, AdminGuard)
  async getAllPagesViews(
    @Query() query: TimeRangeArgs,
  ): Promise<IAllPageViews[]> {
    const { startDate, endDate } = query;
    return await this.seoAnalyticsService.getAllPagesViews(startDate, endDate);
  }

  @Get('page-views-by-page')
  @UseGuards(JwtUserGuard, AdminGuard)
  async getPagesViewsByPage(
    @Query() query: PageTimeQueryDto,
  ): Promise<IPageViewsPerDay[]> {
    const { startDate, endDate, page } = query;
    return await this.seoAnalyticsService.getPagesViewsPerDay(
      page,
      startDate,
      endDate,
    );
  }

  @Get('country-views-by-page')
  @UseGuards(JwtUserGuard, AdminGuard)
  async getCountryViewsByPageWithPeroid(
    @Query() query: PageTimeQueryDto,
  ): Promise<ICountriesViewsByPagePerDay[]> {
    const { startDate, endDate, page } = query;
    return await this.seoAnalyticsService.getCountryViewsByPageWithPeriod(
      startDate,
      endDate,
      page,
    );
  }
}
