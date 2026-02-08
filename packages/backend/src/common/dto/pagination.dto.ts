import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  offset: number;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;
}
