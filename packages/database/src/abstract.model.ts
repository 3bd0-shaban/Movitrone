import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AbstractModel {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  key: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
