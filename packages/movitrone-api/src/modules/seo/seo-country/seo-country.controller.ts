import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { SeoCountryService } from './seo-country.service';
import { CreateSeoCountryDto } from './dto/create-seo-country.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAdminGuard, JwtUserGuard } from '../../auth/guards/jwt-auth.guard';
import { DashboardGuard } from '../../auth/guards/dashboard.guard';
import { CurrentUser } from '../../auth/decorator/auth-user.decorator';
import { LogService } from '../../log/log.service';
import { SeoAnalyticsService } from '../../analytics/seo-analytics/seo-analytics.service';
import { SeoCountryEntity } from './entities/seo-country.entity';
import { PaginationArgs } from '~/shared/dto/args/pagination-query.args';
import { SeoPageService } from '../seo-page/seo-page.service';
import { AdminEntity } from '../../users/admin/entities/admin.entity';

@ApiTags('Seo Countries')
@ApiBearerAuth()
@Controller('seo-country')
export class SeoCountryController {
  constructor(
    private readonly seoCountryService: SeoCountryService,
    private readonly logService: LogService,
    private readonly seoAnalyticsService: SeoAnalyticsService,
    private readonly seoPageService: SeoPageService,
  ) {}

  @Post()
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async create(
    @Body() inputs: CreateSeoCountryDto,
    @CurrentUser() user: AdminEntity,
  ) {
    const seo = await this.seoCountryService.create(inputs);
    await this.logService.create(
      `create new seo for country ${seo.country} in page ${seo.page}`,
      user,
    );
  }

  @Get()
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async findAll(
    @Query() query: PaginationArgs,
  ): Promise<{ seos: SeoCountryEntity[]; results: number; total: number }> {
    return await this.seoCountryService.findAll(query);
  }

  @Get('get/:country')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async findOne(@Param('country') country: string): Promise<SeoCountryEntity> {
    return await this.seoCountryService.findOneByCountry(country);
  }

  @Put('main/:country')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async Main(
    @Param('country') country: string,
    @CurrentUser() user: AdminEntity,
  ): Promise<void> {
    const seo = await this.seoCountryService.MarkMain(country);
    await this.logService.create(
      `marked seo record for ${seo.country} country as main`,
      user,
    );
  }

  @Delete('delete/:country')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async remove(
    @Param('country') country: string,
    @CurrentUser() user: AdminEntity,
  ): Promise<void> {
    const seoCountry = await this.seoCountryService.findOneByCountry(country);
    await this.seoPageService.removeAllByCountry(seoCountry);
    await this.seoCountryService.removeByCountry(seoCountry);
    await this.logService.create(`deleted seo record`, user);
  }
}
