import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { JwtAdminGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardGuard } from '../auth/guards/dashboard.guard';
import { PaginationArgs } from 'src/shared/dto/args/pagination-query.args';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Genre')
@ApiBearerAuth()
@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post('create-genre')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  create(@Body() CreateGenreDto: CreateGenreDto) {
    return this.genreService.create(CreateGenreDto);
  }

  @Get('all-genres')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async findAll(
    @Query() query: PaginationArgs,
  ): Promise<{ genres: GenreEntity[]; total: number }> {
    return await this.genreService.findAll(query);
  }

  @Get('get/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  findOne(@Param('id') id: number): Promise<GenreEntity> {
    return this.genreService.findOne(id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async update(
    @Param('id') id: number,
    @Body() UpdateGenreDto: UpdateGenreDto,
  ): Promise<string> {
    await this.genreService.update(id, UpdateGenreDto);
    return 'ok';
  }

  @Delete('delete/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  remove(@Param('id') id: number): Promise<void> {
    return this.genreService.removeById(id);
  }
}
