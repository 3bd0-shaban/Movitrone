import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeoPageDto } from './dto/create-seo.dto';
import { UpdateSeoPageDto } from './dto/update-seo.dto';
import { ErrorEnum } from '~/constants/error-code.constant';
import { PaginationArgs } from '~/shared/dto/args/pagination-query.args';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { isEmpty } from 'lodash';
import { SeoPageEntity } from './entities/seo-page.entity';
import { SeoCountryEntity } from '../seo-country/entities/seo-country.entity';
import { SeoCountryService } from '../seo-country/seo-country.service';
import { SEO_PAGES_ENUM } from './seo-page.constant';

@Injectable()
export class SeoPageService {
  constructor(
    @InjectRepository(SeoPageEntity)
    private readonly seoPageRepository: Repository<SeoPageEntity>,
    private readonly seoCountryService: SeoCountryService,
  ) {}

  /**
   * Create New seo
   *
   * @param {CreateSeoPageDto} inputs - entered inputs
   * @param {SeoCountryEntity} country - country documnet
   * @returns {Promise<SeoPageEntity>} - Created seo entity
   * @memberof seoservice
   */
  async create(
    inputs: CreateSeoPageDto,
    country: SeoCountryEntity,
  ): Promise<SeoPageEntity> {
    const { page } = inputs;

    await this.validateSeoExistsByPage(page);
    await this.seoCountryService.validateSeoCountryExists(page);

    const seo = this.seoPageRepository.create({
      country,
      ...inputs,
    });

    return this.seoPageRepository.save(seo);
  }

  /**
   * Get All seo pages with pagination
   *
   * @param {PaginationArgs} pagination - pagination inputs
   * @returns {Promise<{ seos: SeoPageEntity[]; results: number; total: number }>} - Paginated seos
   * @memberof seoservice
   */
  async findAll(
    pagination: PaginationArgs,
  ): Promise<{ seos: SeoPageEntity[]; results: number; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const [seos, total] = await this.seoPageRepository.findAndCount({
      take: limit,
      skip,
    });
    return { total, results: seos.length, seos };
  }

  /**
   * Get All seo for country
   *
   * @param {PaginationArgs} pagination - pagination inputs
   * @param {string} country - country filter
   * @returns {Promise<{ seos: SeoPageEntity[]; results: number; total: number }>} - Paginated seos
   * @memberof seoservice
   */
  async findSeoPagesByCountry(
    pagination: PaginationArgs,
    country: string,
  ): Promise<{ seos: SeoPageEntity[]; results: number; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.seoPageRepository
      .createQueryBuilder('seo')
      .leftJoinAndSelect('seo.country', 'country')
      .where('country.country = :country', { country: country })
      .take(limit)
      .skip(skip);

    const [seos, total] = await queryBuilder.getManyAndCount();

    return { total, results: seos.length, seos };
  }

  /**
   * Find a seo by ID
   *
   * @param {number} id - seo ID
   * @returns {Promise<SeoPageEntity>} - The found seo
   * @throws {NotFoundException} - If the seo with the provided ID is not found
   */
  async findOneByID(id: number): Promise<SeoPageEntity> {
    const seo = await this.seoPageRepository.findOneBy({ id });
    if (!seo) {
      throw new NotFoundException(ErrorEnum.SEO_PAGE_NOT_EXIST);
    }
    return seo;
  }

  /**
   * Find an SEO by country and page
   *
   * @param {SEO_PAGES_ENUM} page - page of the website
   * @param {string} country - country code
   * @returns {Promise<SeoPageEntity>} - The found SEO entity
   */
  async findSeoByCountryAndPage(
    page: SEO_PAGES_ENUM,
    country: string,
  ): Promise<SeoPageEntity> {
    // Attempt to find the SEO page by country and page
    let seo = await this.seoPageRepository
      .createQueryBuilder('seo')
      .leftJoinAndSelect('seo.country', 'country')
      .where('seo.page = :page', { page })
      .andWhere('country.country = :country', { country })
      .getOne();

    if (!seo) {
      // If not found, find the main SEO country
      const mainSeoCountry = await this.seoCountryService.findMainSeo();

      if (mainSeoCountry) {
        // Attempt to find the SEO page for the main SEO country
        seo = await this.findSeoByCountryAndPageForMainCountry(
          page,
          mainSeoCountry.country,
        );

        if (!seo) {
          // If still not found, fallback to the home page for the main SEO country
          seo = await this.findSeoByCountryAndPageForMainCountry(
            SEO_PAGES_ENUM.HOME,
            mainSeoCountry.country,
          );
        }
      }
    }

    return seo;
  }

  /**
   * Find an SEO by page for the main SEO country
   *
   * @param {SEO_PAGES_ENUM} page - page of the website
   * @param {string} mainCountry - main SEO country code
   * @returns {Promise<SeoPageEntity>} - The found SEO entity
   */
  private async findSeoByCountryAndPageForMainCountry(
    page: SEO_PAGES_ENUM,
    mainCountry: string,
  ): Promise<SeoPageEntity> {
    return this.seoPageRepository
      .createQueryBuilder('seo')
      .leftJoinAndSelect('seo.country', 'country')
      .where('seo.page = :page', { page })
      .andWhere('country.country = :country', { country: mainCountry })
      .getOne();
  }

  /**
   * Update seo
   *
   * @param {number} seoId - seo ID
   * @param {UpdateSeoPageDto} inputs - Updated seo params
   * @returns {Promise<UpdateResult>} - The updated seo
   */
  async update(seoId: number, inputs: UpdateSeoPageDto): Promise<UpdateResult> {
    return await this.seoPageRepository.update(seoId, inputs);
  }

  /**
   * Remove a seo by ID
   *
   * @param {number} seoID - seo ID
   * @throws {NotFoundException} - If the seo with the provided ID is not found
   */
  async removeById(seoID: number): Promise<void> {
    const seo = await this.findOneByID(seoID);
    await this.seoPageRepository.remove(seo);
  }

  /**
   * Remove all SEO pages by country
   *
   * @param {SeoCountryEntity} country - The country entity
   */
  async removeAllByCountry(country: SeoCountryEntity): Promise<void> {
    const seoPages = await this.seoPageRepository
      .createQueryBuilder('seoPage')
      .where('seoPage.countryCountry = :country', { country: country.country })
      .getMany();

    await this.seoPageRepository.remove(seoPages);
  }

  private async validateSeoExistsByPage(page: SEO_PAGES_ENUM): Promise<void> {
    const exists = await this.seoPageRepository.findOneBy({
      page,
    });
    if (!isEmpty(exists)) {
      throw new ConflictException(ErrorEnum.SEO_PAGE_ALREADY_EXIST);
    }
  }
}
