import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class WaitlistEntry {
  @Field()
  email: string;

  @Field(() => Int)
  position: number;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class WaitlistStatus {
  @Field()
  email: string;

  @Field(() => Int)
  position: number;

  @Field(() => Int)
  totalEntries: number;

  @Field()
  createdAt: Date;
}
