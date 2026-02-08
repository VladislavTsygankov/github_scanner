import { Inject, Injectable } from "@nestjs/common";
import { RepoDTO } from "./dto/repo.dto";
import { RepoDetailsDTO, YmlFile } from "./dto/repo-details.dto";
import type { IGithubRepository } from "./interfaces/github.repository";
import pLimit, { LimitFunction } from "p-limit";
import { PaginationInput } from "src/common/dto/pagination.dto";

@Injectable()
export class GithubService {
  private readonly rateLimiter: LimitFunction;

  constructor(@Inject("IGithubRepository") private readonly githubRepo: IGithubRepository) {
    this.rateLimiter = pLimit(2);
  }

  async listRepos(pagination: PaginationInput): Promise<RepoDTO[]> {
    return await this.githubRepo.fetchRepoList(pagination);
  }

  async getRepoDetails(owner: string, repos: string[]): Promise<RepoDetailsDTO[]> {
    const tasks = repos.map((repo) =>
      this.rateLimiter(async () => {
        const repoData = await this.githubRepo.fetchRepo(owner, repo);
        const ymlContent = await this.getYmlFileContent(owner, repo);
        const webhooks = await this.githubRepo.fetchWebhooks(owner, repo);

        return {
          id: repoData.id,
          name: repoData.name,
          size: repoData.size,
          owner: repoData.owner,
          isPrivate: repoData.isPrivate,
          filesCount: repoData.filesCount,
          ymlContent,
          webhooks,
        };
      }),
    );

    return await Promise.all(tasks);
  }

  private async getYmlFileContent(
    owner: string,
    repo: string,
    path: string = "",
  ): Promise<YmlFile | null> {
    const contents = await this.githubRepo.fetchRepoContents(owner, repo, path);

    if (Array.isArray(contents)) {
      for (const item of contents) {
        if (item.type === "file" && (item.name.endsWith(".yml") || item.name.endsWith(".yaml"))) {
          const fileContent = await this.githubRepo.fetchFileContent(item.download_url);

          return {
            name: item.name,
            size: item.size,
            url: item.url,
            path: item.path,
            fileContent: fileContent || "",
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
        fileContent: fileContent || "",
      };
    }

    return null;
  }
}
