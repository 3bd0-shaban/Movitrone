import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeoService } from './seo.service';
import { CreateSeoDto } from './dto/create-seo.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';

@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Post()
  create(@Body() createSeoDto: CreateSeoDto) {
    return this.seoService.create(createSeoDto);
  }

  @Get()
  findAll() {
    return this.seoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeoDto: UpdateSeoDto) {
    return this.seoService.update(+id, updateSeoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seoService.remove(+id);
  }
}
