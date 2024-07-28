import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { SeasionService } from './seasion.service';
import { CreateSeasionDto } from './dto/create-seasion.dto';
import { UpdateSeasionDto } from './dto/update-seasion.dto';

@Controller('Seasion')
export class SeasionController {
  constructor(private readonly SeasionService: SeasionService) {}

  @Post()
  create(@Body() createSeasionDto: CreateSeasionDto) {
    return this.SeasionService.create(createSeasionDto);
  }

  @Get()
  findAll() {
    return this.SeasionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.SeasionService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSeasionDto: UpdateSeasionDto) {
    return this.SeasionService.update(+id, updateSeasionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.SeasionService.remove(+id);
  }
}
