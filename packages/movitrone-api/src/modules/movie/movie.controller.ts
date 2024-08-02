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
import { MovieEntity } from './entities/movie.entity';
import { ApiTags } from '@nestjs/swagger';
import { PagerDto } from '~/common/dto/pager.dto';
import { Pagination } from '~/helper/paginate/pagination';

@ApiTags('Movies')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('create-movie')
  @UseGuards(JwtAdminGuard)
  create(@Body() CreateMovieDto: CreateMovieDto) {
    return this.movieService.create(CreateMovieDto);
  }

  @Get('all-movies')
  @UseGuards(JwtAdminGuard)
  async findAll(@Query() query: PagerDto): Promise<Pagination<MovieEntity>> {
    return await this.movieService.findAll(query);
  }

  @Get('get/:id')
  @UseGuards(JwtAdminGuard)
  findOne(@Param('id') id: number): Promise<MovieEntity> {
    return this.movieService.findOne(id);
  }

  @Put('update/:id')
  @UseGuards(JwtAdminGuard)
  async update(
    @Param('id') id: number,
    @Body() UpdateMovieDto: UpdateMovieDto,
  ): Promise<string> {
    await this.movieService.update(id, UpdateMovieDto);
    return 'ok';
  }

  @Delete('delete/:id')
  @UseGuards(JwtAdminGuard)
  remove(@Param('id') id: number): Promise<void> {
    return this.movieService.removeById(id);
  }
}
