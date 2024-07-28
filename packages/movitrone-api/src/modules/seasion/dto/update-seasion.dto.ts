import { PartialType } from '@nestjs/mapped-types';
import { CreateSeasionDto } from './create-seasion.dto';

export class UpdateSeasionDto extends PartialType(CreateSeasionDto) {}
