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
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAdminGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardGuard } from '../auth/guards/dashboard.guard';
import { PaginationArgs } from '~/shared/dto/args/pagination-query.args';
import { MovieEntity } from './entities/movie.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Movies')
@ApiBearerAuth()
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('create-movie')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  create(@Body() CreateMovieDto: CreateMovieDto) {
    return this.movieService.create(CreateMovieDto);
  }

  @Get('all-movies')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async findAll(
    @Query() query: PaginationArgs,
  ): Promise<{ movies: MovieEntity[]; total: number }> {
    return await this.movieService.findAll(query);
  }

  @Get('get/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  findOne(@Param('id') id: number): Promise<MovieEntity> {
    return this.movieService.findOne(id);
  }

  @Put('update/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async update(
    @Param('id') id: number,
    @Body() UpdateMovieDto: UpdateMovieDto,
  ): Promise<string> {
    await this.movieService.update(id, UpdateMovieDto);
    return 'ok';
  }

  @Delete('delete/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  remove(@Param('id') id: number): Promise<void> {
    return this.movieService.removeById(id);
  }
}
