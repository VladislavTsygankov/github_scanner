import { Inject, Injectable } from "@nestjs/common";
import { RepoDTO } from "./dto/repo.dto";
import { RepoDetailsDTO } from "./dto/repo-details.dto";
import type { IGithubRepository } from "./interfaces/github.repository";
import pLimit from "p-limit";
import { PaginationInput } from "src/common/dto/pagination.dto";

@Injectable()
export class GithubService {
  constructor(@Inject("IGithubRepository") private readonly githubRepo: IGithubRepository) {}

  async listRepos(pagination: PaginationInput): Promise<RepoDTO[]> {
    return await this.githubRepo.fetchRepoList(pagination);
  }

  async getRepoDetails(owner: string, repo: string): Promise<RepoDetailsDTO> {
    const repoData = await this.githubRepo.fetchRepo(owner, repo);
    const ymlContent = await this.getYmlFileContent(owner, repo);
    const webhooks = await this.githubRepo.fetchWebhooks(owner, repo);

    return {
      id: repoData.id,
      name: repoData.name,
      size: repoData.size,
      owner: repoData.owner,
      isPrivate: true,
      filesCount: 0,
      ymlContent,
      webhooks,
    };
  }

  private async getYmlFileContent(owner: string, repo: string, path: string = "") {
    const contents = await this.githubRepo.fetchRepoContents(owner, repo, path);

    if (Array.isArray(contents)) {
      for (const item of contents) {
        if (item.type === "file" && (item.name.endsWith(".yml") || item.name.endsWith(".yaml"))) {
          const fileContent = await this.githubRepo.fetchFileContent(item.download_url);

          console.log(fileContent);

          return {
            name: item.name,
            size: item.size,
            url: item.url,
            path: item.path,
            fileContent,
          };
        }

        if (item.type === "dir") {
          const found = await this.getYmlFileContent(owner, repo, item.path);

          if (found) {
            return found;
          }
        }
      }
    } else if (
      contents.type === "file" &&
      (contents.name.endsWith(".yml") || contents.name.endsWith(".yaml"))
    ) {
      const fileContent = await this.githubRepo.fetchFileContent(contents.download_url);

      return {
        name: contents.name,
        size: contents.size,
        url: contents.url,
        path: contents.path,
        fileContent,
      };
    }

    return null;
  }

  async getMultipleRepoDetails(
    repos: { owner: string; repo: string }[],
  ): Promise<RepoDetailsDTO[]> {
    const limit = pLimit(2);

    const tasks = repos.map(({ owner, repo }) => limit(() => this.getRepoDetails(owner, repo)));

    const results = await Promise.all(tasks);
    return results;
  }
}
