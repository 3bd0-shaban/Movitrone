import { Injectable } from '@nestjs/common';
import { CreateSeasionDto } from './dto/create-seasion.dto';
import { UpdateSeasionDto } from './dto/update-seasion.dto';

@Injectable()
export class SeasionService {
  create(createSeasionDto: CreateSeasionDto) {
    return 'This action adds a new Seasion';
  }

  findAll() {
    return `This action returns all Seasion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} Seasion`;
  }

  update(id: number, updateSeasionDto: UpdateSeasionDto) {
    return `This action updates a #${id} Seasion`;
  }

  remove(id: number) {
    return `This action removes a #${id} Seasion`;
  }
}
