import { Field, Int, ObjectType } from "@nestjs/graphql";
import { RepoDTO } from "./repo.dto";

@ObjectType()
export class YmlFile {
  @Field()
  name: string;
  @Field()
  size: number;
  @Field()
  url: string;
  @Field()
  path: string;
  @Field()
  fileContent: string;
}

@ObjectType()
export class Webhook {
  @Field()
  id: number;
  @Field()
  active: boolean;
  @Field()
  name: string;
  @Field()
  type: string;
}

@ObjectType()
export class RepoDetailsDTO extends RepoDTO {
  @Field()
  isPrivate: boolean;

  @Field(() => Int)
  filesCount: number;

  @Field(() => YmlFile, { nullable: true })
  ymlContent: YmlFile | null;

  @Field(() => [Webhook])
  webhooks?: Webhook[];
}
