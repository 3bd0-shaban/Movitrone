import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeoDto } from './dto/create-seo.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';
import { ErrorEnum } from '~/constants/error-code.constant';
import { SeoEntity } from './entities/seo.entity';
import { PaginationArgs } from '~/shared/dto/args/pagination-query.args';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { isEmpty } from 'lodash';

@Injectable()
export class SeoService {
  constructor(
    @InjectRepository(SeoEntity)
    private readonly seoRepository: Repository<SeoEntity>,
  ) {}

  /**
   * Create New seo
   *
   * @param {CreateSeoDto} inputs - entered inputs
   * @returns {Promise<SeoEntity>} - Created seo entity
   * @memberof seoservice
   */
  async create(inputs: CreateSeoDto): Promise<SeoEntity> {
    const { page, country } = inputs;
    await this.validateSeoExists(page, country);

    const seo = this.seoRepository.create({
      ...inputs,
    });

    return this.seoRepository.save(seo);
  }

  /**
   * Get All seo with pagination
   *
   * @param {PaginationArgs} pagination - pagination inputs
   * @returns {Promise<{ seos: SeoEntity[]; results: number; total: number }>} - Paginated seos
   * @memberof seoservice
   */
  async findAll(
    pagination: PaginationArgs,
  ): Promise<{ seos: SeoEntity[]; results: number; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const [seos, total] = await this.seoRepository.findAndCount({
      take: limit,
      skip,
    });
    return { total, results: seos.length, seos };
  }

  /**
   * Get All seo for country
   *
   * @param {PaginationArgs} pagination - pagination inputs
   * @returns {Promise<{ seos: SeoEntity[]; results: number; total: number }>} - Paginated seos
   * @memberof seoservice
   */
  async findAllSeoByCountry(
    pagination: PaginationArgs,
    country: string,
  ): Promise<{ seos: SeoEntity[]; results: number; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const [seos, total] = await this.seoRepository.findAndCount({
      where: { country },
      take: limit,
      skip,
    });
    return { total, results: seos.length, seos };
  }

  /**
   * Find a seo by ID
   *
   * @param {number} id - seo ID
   * @returns {Promise<SeoEntity>} - The found seo
   * @throws {NotFoundException} - If the seo with the provided ID is not found
   */
  async findOne(id: number): Promise<SeoEntity> {
    const seo = await this.seoRepository.findOneBy({ id });
    if (!seo) {
      throw new NotFoundException(ErrorEnum.SEO_NOT_EXIST);
    }
    return seo;
  }

  /**
   * Find a seo by ID
   *
   * @param {string} country - country code
   * @param {string} page - page of website
   * @returns {Promise<SeoEntity>} - The found seo
   */
  async seoByCountryAndPage(page: string, country: string): Promise<SeoEntity> {
    let seo: SeoEntity;

    seo = await this.seoRepository.findOneBy({ country, page });

    if (!seo) {
      seo = await this.seoRepository.findOneBy({ is_Main: true, page });
    }

    if (!seo) {
      seo = await this.seoRepository.findOneBy({ is_Main: true, page: 'Home' });
    }

    return seo;
  }

  /**
   * Update seo
   *
   * @param {number} seoId - seo ID
   * @param {UpdateseoDto} inputs - Updated seo params
   * @returns {Promise<UpdateResult>} - The updated seo
   */
  async update(seoId: number, inputs: UpdateSeoDto): Promise<UpdateResult> {
    const { page, country } = inputs;
    await this.validateSeoExists(page, country);

    return await this.seoRepository.update(seoId, inputs);
  }

  /**
   * mark seo as main
   *
   * @param {number} seoId - seo ID
   * @returns {Promise<UpdateResult>} - The updated seo
   */
  async MarkMain(seoId: number): Promise<SeoEntity> {
    await this.seoRepository.query('BEGIN');

    // Update all SEO entries with is_Main true to false
    await this.seoRepository
      .createQueryBuilder()
      .update(SeoEntity)
      .set({ is_Main: false })
      .where('is_Main = :is_Main', { is_Main: true })
      .execute();

    // Find the SEO entry by ID
    const seo = await this.seoRepository.findOneBy({ id: seoId });

    if (!seo) {
      // Rollback the transaction if SEO with the specified ID is not found
      await this.seoRepository.query('ROLLBACK');
      throw new ConflictException(ErrorEnum.SEO_ALREADY_EXIST);
    }

    // Update all SEO entries with the same country as the found SEO to is_Main true
    await this.seoRepository
      .createQueryBuilder()
      .update(SeoEntity)
      .set({ is_Main: true })
      .where('country = :country', { country: seo.country })
      .execute();

    // Commit the transaction
    await this.seoRepository.query('COMMIT');
    return seo;
  }

  /**
   * Remove a seo by ID
   *
   * @param {number} seoID - seo ID
   * @throws {NotFoundException} - If the seo with the provided ID is not found
   */
  async removeById(seoID: number): Promise<void> {
    const seo = await this.findOne(seoID);
    await this.seoRepository.remove(seo);
  }

  private async validateSeoExists(
    page: string,
    country: string,
  ): Promise<void> {
    const exists = await this.seoRepository.findOneBy({
      country,
      page,
    });
    if (!isEmpty(exists)) {
      throw new ConflictException(ErrorEnum.SEO_ALREADY_EXIST);
    }
  }
}
