import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsDecimal } from 'class-validator';

@InputType()
export class MapInputs {
  @Field(() => Float)
  @IsNotEmpty()
  @IsDecimal({})
  lng: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsDecimal()
  lat: number;
}
