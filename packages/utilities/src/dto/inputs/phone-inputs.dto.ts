import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class phoneInputs {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  number: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  code: string;
}
