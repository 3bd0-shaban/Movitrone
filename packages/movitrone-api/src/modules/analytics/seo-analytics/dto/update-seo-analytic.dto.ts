import { PartialType } from '@nestjs/mapped-types';
import { CreateSeoAnalyticDto } from './create-seo-analytic.dto';

export class UpdateSeoAnalyticDto extends PartialType(CreateSeoAnalyticDto) {}
