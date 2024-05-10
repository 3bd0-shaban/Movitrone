import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieEntity } from './entities/movie.entity';
import { ErrorEnum } from '~/constants/error-code.constant';
import { isEmpty } from 'lodash';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs } from '~/shared/dto/args/pagination-query.args';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  /**
   * Create New movie
   *
   * @param {CreateMovieDto} CreateMovieDto - enterted inputs
   * @returns {Promise<MovieEntity>} - Password match result
   * @memberof Movieservice
   */
  async create(inputs: CreateMovieDto): Promise<MovieEntity> {
    const { movie_Title } = inputs;
    const exists = await this.movieRepository.findOneBy({
      movie_Title,
    });
    if (!isEmpty(exists)) {
      throw new ConflictException(ErrorEnum.MOVIE_ALREADY_EXIST);
    }
    const movieDoc = this.movieRepository.create({
      ...inputs,
    });
    return await movieDoc.save();
  }

  /**
   * Get All Movies with pagination
   *
   * @param {PaginationArgs} pagination - pagination inputs
   * @returns {Promise<{ Movies: MovieEntity[]; results: number; total: number }>} - Paginated Movies
   * @memberof Movieservice
   */
  async findAll(
    pagination: PaginationArgs,
  ): Promise<{ movies: MovieEntity[]; results: number; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const [movies, total] = await this.movieRepository.findAndCount({
      relations: ['genres'],
      take: limit,
      skip,
    });
    return { total, results: movies.length, movies };
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
