import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GenreEntity } from './entities/genre.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { isEmpty } from 'lodash';
import { PaginationArgs } from 'src/shared/dto/args/pagination-query.args';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
  ) {}

  /**
   * Create New Genre
   *
   * @param {CreategenreDTO} creategenreDto - enterted inputs
   * @returns {Promise<GenreEntity>} - Password match result
   * @memberof genreService
   */
  async create(inputs: CreateGenreDto): Promise<GenreEntity> {
    const { genre } = inputs;
    const exists = await this.genreRepository.findOneBy({
      genre,
    });
    if (!isEmpty(exists)) {
      throw new ConflictException(ErrorEnum.GENRE_ALREADY_EXIST);
    }
    const genreDoc = this.genreRepository.create({
      ...inputs,
    });
    return await genreDoc.save();
  }

  /**
   * Get All Genres with pagination
   *
   * @param {PaginationArgs} pagination - pagination inputs
   * @returns {Promise<{ genres: GenreEntity[]; results: number; total: number }>} - Paginated genres
   * @memberof GenreService
   */
  async findAll(
    pagination: PaginationArgs,
  ): Promise<{ genres: GenreEntity[]; results: number; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const [genres, total] = await this.genreRepository.findAndCount({
      take: limit,
      skip,
    });
    return { total, results: genres.length, genres };
  }

  /**
   * Find a genre by ID
   *
   * @param {number} id - genre ID
   * @returns {Promise<GenreEntity>} - The found genre
   * @throws {NotFoundException} - If the genre with the provided ID is not found
   */
  async findOne(id: number): Promise<GenreEntity> {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) {
      throw new NotFoundException(ErrorEnum.GENRE_NOT_EXIST);
    }
    return genre;
  }

  /**
   * Remove a genre by ID
   *
   * @param {number} genreID - genre ID
   * @throws {NotFoundException} - If the genre with the provided ID is not found
   */
  async removeById(genreID: number): Promise<void> {
    const genre = await this.findOne(genreID);
    await this.genreRepository.remove(genre);
  }

  /**
   * Update the currently authenticated genre
   *
   * @param {number} genreId - genre ID
   * @param {UpdategenreDTO} inputs - Updated genre params
   * @returns {Promise<UpdateResult>} - The updated genre
   */
  async update(genreID: number, inputs: UpdateGenreDto): Promise<UpdateResult> {
    return await this.genreRepository.update(genreID, inputs);
  }
}
