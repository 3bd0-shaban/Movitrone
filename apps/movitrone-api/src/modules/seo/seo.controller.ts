import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SeoService } from './seo.service';
import { CreateSeoDto } from './dto/create-seo.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';
import { JwtAdminGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardGuard } from '../auth/guards/dashboard.guard';
import { PaginationArgs } from '~/shared/dto/args/pagination-query.args';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SeoEntity } from './entities/seo.entity';
import { LogService } from '../log/log.service';
import { CurrentUser } from '../auth/decorator/auth-user.decorator';
import { AdminEntity } from '../admin/entities/admin.entity';
import { SeoWebsitePages } from './dto/args/seo-query.args';
import { SeoAnalyticsService } from '../analytics/seo-analytics/seo-analytics.service';

@ApiTags('Seo')
@ApiBearerAuth()
@Controller('seo')
export class SeoController {
  constructor(
    private readonly seoService: SeoService,
    private readonly logService: LogService,
    private readonly seoAnalyticsService: SeoAnalyticsService,
  ) {}

  @Post()
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async create(
    @Body() CreateMovieDto: CreateSeoDto,
    @CurrentUser() user: AdminEntity,
  ) {
    const seo = await this.seoService.create(CreateMovieDto);
    await this.logService.create(
      `create new seo for country ${seo.country} in page ${seo.page}`,
      user,
    );
  }

  @Get()
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async findAll(
    @Query() query: PaginationArgs,
  ): Promise<{ seos: SeoEntity[]; results: number; total: number }> {
    return await this.seoService.findAll(query);
  }

  @Get('country/:country')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async findAllByCountry(
    @Query() query: PaginationArgs,
    @Param('country') country: string,
  ): Promise<{ seos: SeoEntity[]; results: number; total: number }> {
    return await this.seoService.findAllSeoByCountry(query, country);
  }

  @Get('get/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async findOne(@Param('id') id: number): Promise<SeoEntity> {
    return await this.seoService.findOne(id);
  }

  @Get('country')
  async findByCountryPage(@Query() query: SeoWebsitePages): Promise<SeoEntity> {
    const { code, page } = query;
    const seo = await this.seoService.seoByCountryAndPage(page, code);
    await this.seoAnalyticsService.saveSeoViewPerDay(page, code);
    return seo;
  }

  @Put('update/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async update(
    @Param('id') id: number,
    @CurrentUser() user: AdminEntity,
    @Body() UpdateMovieDto: UpdateSeoDto,
  ): Promise<string> {
    await this.seoService.update(id, UpdateMovieDto);
    await this.logService.create(`updated seo record`, user);
    return 'ok';
  }

  @Put('main/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async Main(
    @Param('id') id: number,
    @CurrentUser() user: AdminEntity,
  ): Promise<void> {
    const seo = await this.seoService.MarkMain(id);
    await this.logService.create(
      `marked seo record for ${seo.country} country as main`,
      user,
    );
  }

  @Delete('delete/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: AdminEntity,
  ): Promise<void> {
    await this.seoService.removeById(id);
    await this.logService.create(`deleted seo record`, user);
  }
}
