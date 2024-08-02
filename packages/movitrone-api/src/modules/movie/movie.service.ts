import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieEntity } from './entities/movie.entity';
import { ErrorEnum } from '~/constants/error-code.constant';
import { In, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GenreEntity } from '../genre/entities/genre.entity';
import { Pagination } from '~/helper/paginate/pagination';
import { PagerDto } from '~/common/dto/pager.dto';
import { paginate } from '~/helper/paginate';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
  ) {}

  /**
   * Create New movie
   *
   * @param {CreateMovieDto} inputs - entered inputs
   * @returns {Promise<MovieEntity>} - Created movie entity
   * @memberof Movieservice
   */
  async create(inputs: CreateMovieDto): Promise<MovieEntity> {
    const { movie_Title, genres: genreIds } = inputs;

    const exists = await this.movieRepository.findOneBy({
      movie_Title,
    });
    if (exists) {
      throw new ConflictException(ErrorEnum.MOVIE_ALREADY_EXIST);
    }

    // Find genres by their IDs
    const genres = await this.genreRepository.find({
      where: { id: In(genreIds) },
    });

    const movie = this.movieRepository.create({
      ...inputs,
      genres: genres,
    });

    return this.movieRepository.save(movie);
  }

  /**
   * Get All Movies with pagination
   *
   * @param {PagerDto} pagination - pagination inputs
   * @returns {Promise<Pagination<MovieEntity>>} - Paginated Movies
   * @memberof Movieservice
   */
  async findAll({
    page,
    pageSize,
  }: PagerDto): Promise<Pagination<MovieEntity>> {
    const queryBuilder = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre');

    return paginate<MovieEntity>(queryBuilder, { page, pageSize });
  }

  /**
   * Find a movie by ID
   *
   * @param {number} id - movie ID
   * @returns {Promise<MovieEntity>} - The found movie
   * @throws {NotFoundException} - If the movie with the provided ID is not found
   */
  async findOne(id: number): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundException(ErrorEnum.MOVIE_NOT_EXIST);
    }
    return movie;
  }

  /**
   * Remove a movie by ID
   *
   * @param {number} movieID - movie ID
   * @throws {NotFoundException} - If the movie with the provided ID is not found
   */
  async removeById(movieID: number): Promise<void> {
    const movie = await this.findOne(movieID);
    await this.movieRepository.remove(movie);
  }

  /**
   * Update the currently authenticated movie
   *
   * @param {number} movieId - movie ID
   * @param {UpdateMovieDto} inputs - Updated movie params
   * @returns {Promise<UpdateResult>} - The updated movie
   */
  async update(movieID: number, inputs: UpdateMovieDto): Promise<UpdateResult> {
    return await this.movieRepository.update(movieID, inputs);
  }
}
