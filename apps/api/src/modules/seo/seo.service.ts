import { Injectable } from '@nestjs/common';
import { CreateSeoDto } from './dto/create-seo.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';

@Injectable()
export class SeoService {
  create(createSeoDto: CreateSeoDto) {
    return 'This action adds a new seo';
  }

  findAll() {
    return `This action returns all seo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seo`;
  }

  update(id: number, updateSeoDto: UpdateSeoDto) {
    return `This action updates a #${id} seo`;
  }

  remove(id: number) {
    return `This action removes a #${id} seo`;
  }
}
