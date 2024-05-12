import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SeoAnalyticsService } from './seo-analytics.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DashboardGuard } from '~/modules/auth/guards/dashboard.guard';
import { JwtAdminGuard } from '~/modules/auth/guards/jwt-auth.guard';
import { TimeRangeArgs } from './dto/args/timeRange-query.args';
import { PageTimeQueryDto } from './dto/args/page-time-query.args';

@ApiTags('Seo Analytics')
@ApiBearerAuth()
@Controller('seo-analytics')
export class SeoAnalyticsController {
  constructor(private readonly seoAnalyticsService: SeoAnalyticsService) {}

  @Get('all-pages-views')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async getAllPagesViews(@Query() query: TimeRangeArgs): Promise<any[]> {
    const { startDate, endDate } = query;
    return await this.seoAnalyticsService.getAllPagesViews(startDate, endDate);
  }

  @Get('page-views-by-page')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async getPagesViewsByPage(@Query() query: PageTimeQueryDto): Promise<any[]> {
    const { startDate, endDate, page } = query;
    return await this.seoAnalyticsService.getPagesViewsPerDay(
      page,
      startDate,
      endDate,
    );
  }

  @Get('country-views-by-page')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async getCountryViewsByPageWithPeroid(
    @Query('page') page: string,
    @Query('start') start: Date,
    @Query('end') end: Date,
  ): Promise<any[]> {
    return await this.seoAnalyticsService.getCountryViewsByPageWithPeriod(
      start,
      end,
      page,
    );
  }
}
