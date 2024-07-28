import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { OperatorDto } from '../dto/operator.dto';
import { Request } from 'express';

@Injectable()
export class CreatorPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  transform(value: OperatorDto, metadata: ArgumentMetadata) {
    const user = this.request.user as any;

    value.createdBy = user.id;

    return value;
  }
}
