import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class PaginateInputs {
  @Field(() => Int)
  @IsNumber()
  page: number;

  @Field(() => Int)
  @IsNumber()
  limit: number;
}
