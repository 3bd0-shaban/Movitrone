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
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { JwtAdminGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { PagerDto } from '~/common/dto/pager.dto';
import { Pagination } from '~/helper/paginate/pagination';

@ApiTags('Genre')
@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post('create-genre')
  @UseGuards(JwtAdminGuard)
  create(@Body() CreateGenreDto: CreateGenreDto) {
    return this.genreService.create(CreateGenreDto);
  }

  @Get('all-genres')
  @UseGuards(JwtAdminGuard)
  async findAll(@Query() query: PagerDto): Promise<Pagination<GenreEntity>> {
    return await this.genreService.findAll(query);
  }

  @Get('get/:id')
  @UseGuards(JwtAdminGuard)
  findOne(@Param('id') id: number): Promise<GenreEntity> {
    return this.genreService.findOne(id);
  }

  @Put('update/:id')
  @UseGuards(JwtAdminGuard)
  async update(
    @Param('id') id: number,
    @Body() UpdateGenreDto: UpdateGenreDto,
  ): Promise<string> {
    await this.genreService.update(id, UpdateGenreDto);
    return 'ok';
  }

  @Delete('delete/:id')
  @UseGuards(JwtAdminGuard)
  remove(@Param('id') id: number): Promise<void> {
    return this.genreService.removeById(id);
  }
}
