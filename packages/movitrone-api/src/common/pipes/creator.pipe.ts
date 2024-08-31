import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { OperatorDto } from '../dto/operator.dto';
import { Request } from 'express';
import { AdminEntity } from '~/modules/users/admin/entities/admin.entity';

@Injectable()
export class CreatorPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  transform(value: OperatorDto, metadata: ArgumentMetadata) {
    const user = this.request.user as AdminEntity;

    value.createBy = user.id;
    return value;
  }
}
