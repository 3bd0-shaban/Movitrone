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
import { SeoPageService } from './seo-page.service';
import { CreateSeoPageDto } from './dto/create-seo.dto';
import { UpdateSeoPageDto } from './dto/update-seo.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogService } from '../../log/log.service';
import { CurrentUser } from '../../auth/decorator/auth-user.decorator';
import { SeoWebsitePages } from './dto/args/seo-query.args';
import { SeoAnalyticsService } from '../../analytics/seo-analytics/seo-analytics.service';
import { JwtAdminGuard } from '../../auth/guards/jwt-auth.guard';
import { SeoPageEntity } from './entities/seo-page.entity';
import { SeoCountryService } from '../seo-country/seo-country.service';
import { AdminEntity } from '../../users/admin/entities/admin.entity';
import { Public } from '~/modules/auth/decorator/public.decorator';
import { PagerDto } from '~/common/dto/pager.dto';
import { Pagination } from '~/helper/paginate/pagination';

@ApiTags('Seo Page')
@Controller('seo-page')
@UseGuards(JwtAdminGuard)
export class SeoPageController {
  constructor(
    private readonly seoService: SeoPageService,
    private readonly logService: LogService,
    private readonly seoCountryService: SeoCountryService,
    private readonly seoAnalyticsService: SeoAnalyticsService,
  ) {}

  @Post('/:country')
  @ApiOperation({ summary: 'Creating Seo page by Country code refrence' })
  async create(
    @Body() CreateMovieDto: CreateSeoPageDto,
    @Param('country') country: string,
    @CurrentUser() user: AdminEntity,
  ) {
    const countrySeo = await this.seoCountryService.findOneByCountry(country);

    const seo = await this.seoService.create(CreateMovieDto, countrySeo);
    await this.logService.create(
      `create new seo for country ${seo.country} in page ${seo.page}`,
      user,
    );
  }

  @Get()
  @ApiOperation({ summary: 'get all seo pages in database with pagination' })
  async findAll(@Query() query: PagerDto): Promise<Pagination<SeoPageEntity>> {
    return await this.seoService.findAll(query);
  }

  @Get('country/:country')
  @ApiOperation({
    summary:
      'get all pages by passing related to specific country by country code refrence with paginations',
  })
  async findAllByCountry(
    @Query() query: PagerDto,
    @Param('country') country: string,
  ): Promise<Pagination<SeoPageEntity>> {
    return await this.seoService.findSeoPagesByCountry(query, country);
  }

  @Get('get/:id')
  @ApiOperation({ summary: "return seo page documnet by it's id" })
  async findOne(@Param('id') id: number): Promise<SeoPageEntity> {
    return await this.seoService.findOneByID(id);
  }

  @Get('country')
  @ApiOperation({
    summary: 'get seo for website pages by the attribute  ( country, page )',
  })
  @Public()
  @ApiBearerAuth('public')
  async findByCountryPage(
    @Query() query: SeoWebsitePages,
  ): Promise<SeoPageEntity> {
    const { code, page } = query;
    const seo = await this.seoService.findSeoByCountryAndPage(page, code);
    await this.seoAnalyticsService.saveSeoViewPerDay(page, code);
    return seo;
  }

  @Put('update/:id')
  @ApiOperation({ summary: "update country seo page document by it's id" })
  async update(
    @Param('id') id: number,
    @CurrentUser() user: AdminEntity,
    @Body() inputs: UpdateSeoPageDto,
  ) {
    await this.seoService.update(id, inputs);
    await this.logService.create(`updated seo record`, user);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: "delete country seo page documnet by it's id" })
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: AdminEntity,
  ): Promise<void> {
    await this.seoService.removeById(id);
    await this.logService.create(`deleted seo record`, user);
  }
}
