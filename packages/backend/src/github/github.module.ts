import { Module } from "@nestjs/common";
import { GithubResolver } from "./github.resolver";
import { GithubService } from "./github.service";
import { GithubRestRepository } from "./github-rest.repository";

@Module({
  providers: [
    GithubResolver,
    GithubService,
    { provide: "IGithubRepository", useClass: GithubRestRepository },
  ],
  exports: [GithubService],
})
export class GithubModule {}
