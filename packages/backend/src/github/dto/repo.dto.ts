import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Owner {
  @Field()
  avatarUrl?: string;
  @Field()
  id: number;
  @Field()
  login: string;
  @Field()
  url: string;
}

@ObjectType()
export class RepoDTO {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field(() => Int)
  size: number;

  @Field()
  owner: Owner;
}
