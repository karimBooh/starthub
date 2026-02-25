import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class EmailArgs {
  @Field()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
