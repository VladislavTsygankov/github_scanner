import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { GithubModule } from "./github/github.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      playground: {
        settings: {
          "editor.cursorShape": "line",
          "request.credentials": "include",
        },
      },
      introspection: true,
    }),
    GithubModule,
  ],
})
export class AppModule {}
