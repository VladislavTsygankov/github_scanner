import { Args, Query, Resolver } from "@nestjs/graphql";
import { GithubService } from "./github.service";
import { RepoDTO } from "./dto/repo.dto";
import { RepoDetailsDTO } from "./dto/repo-details.dto";

import { PaginationInput } from "src/common/dto/pagination.dto";

@Resolver()
export class GithubResolver {
  constructor(private readonly githubService: GithubService) {}

  @Query(() => [RepoDTO])
  async listRepos(
    @Args("pagination", { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput = { offset: 1, limit: 10 },
  ): Promise<RepoDTO[]> {
    return this.githubService.listRepos(pagination);
  }

  @Query(() => RepoDetailsDTO)
  async repoDetails(
    @Args("repo") repo: string,
    @Args("owner") owner: string,
  ): Promise<RepoDetailsDTO> {
    return this.githubService.getRepoDetails(owner, repo);
  }
}
