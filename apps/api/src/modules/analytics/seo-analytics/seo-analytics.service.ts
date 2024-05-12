// seo-analytics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeoAnalyticsEntity } from './entities/seo-analytics.entity';
import {
  IAllPageViews,
  ICountriesViewsByPagePerDay,
  IPageViewsPerDay,
} from './seo-analytics';

@Injectable()
export class SeoAnalyticsService {
  constructor(
    @InjectRepository(SeoAnalyticsEntity)
    private readonly seoAnalyticsRepository: Repository<SeoAnalyticsEntity>,
  ) {}

  /**
   * ensure saveing only one record per day with views counts
   *
   * @param {string} pageSeo - seo page
   * @param {string} country - country code
   * @returns {Promise<SeoAnalyticsEntity>} - The updated SeoAnalyticsEntity
   */
  async saveSeoViewPerDay(pageSeo: string, country: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let seo = await this.seoAnalyticsRepository.findOneBy({
      timestamp: today,
      country,
      page_Seo: pageSeo,
    });

    if (!seo) {
      seo = new SeoAnalyticsEntity();
      seo.timestamp = today;
      seo.page_Seo = pageSeo;
      seo.country = country;
      seo.views_Counts = 1;
    } else {
      seo.views_Counts++;
    }

    await this.seoAnalyticsRepository.save(seo);
  }

  /**
   * get The Summtion of every page view in range of time
   *
   * @param {string} startDate - startDate date
   * @param {string} endDate - endDate date
   * @returns {Promise<SeoAnalyticsEntity>} -  SeoAnalyticsEntity
   */
  async getAllPagesViews(
    startDate: Date,
    endDate: Date,
  ): Promise<IAllPageViews[]> {
    return this.seoAnalyticsRepository
      .createQueryBuilder('seo')
      .select('seo.page_Seo', 'page')
      .addSelect('SUM(seo.views_Counts)', 'views')
      .where('seo.timestamp BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('seo.page_Seo')
      .getRawMany();
  }

  /**
   * get every page by day view in range of time
   *
   * @param {Date} startDate - startDate date
   * @param {Date} endDate - endDate date
   * @returns {Promise<SeoAnalyticsEntity>} -  SeoAnalyticsEntity
   */
  async getPagesViewsPerDay(
    page: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IPageViewsPerDay[]> {
    return this.seoAnalyticsRepository
      .createQueryBuilder('seo')
      .select('DATE(seo.timestamp)', 'day')
      .addSelect('SUM(seo.views_Counts)', 'views')
      .where(
        'seo.page_Seo = :page AND seo.timestamp BETWEEN :startDate AND :endDate',
        {
          page,
          startDate,
          endDate,
        },
      )
      .groupBy('day')
      .getRawMany();
  }

  /**
   * get The summation of views per page in range of time
   *
   * @param {string} startDate - startDate date
   * @param {string} endDate - endDate date
   * @param {string} page - endDate date
   * @returns {Promise<SeoAnalyticsEntity>} -  SeoAnalyticsEntity
   */
  async getCountryViewsByPageWithPeriod(
    startDate: Date,
    endDate: Date,
    page: string,
  ): Promise<ICountriesViewsByPagePerDay[]> {
    return this.seoAnalyticsRepository
      .createQueryBuilder('seo')
      .select('seo.country', 'country')
      .addSelect('SUM(seo.views_Counts)', 'views')
      .where(
        'seo.page_Seo = :page AND seo.timestamp BETWEEN :startDate AND :endDate',
        {
          page,
          startDate,
          endDate,
        },
      )
      .groupBy('seo.country')
      .getRawMany();
  }
}
