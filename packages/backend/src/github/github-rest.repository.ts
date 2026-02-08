import { Injectable } from "@nestjs/common";
import { RepoDetailsDTO, Webhook } from "./dto/repo-details.dto";
import { RepoDTO } from "./dto/repo.dto";
import { IGithubRepository } from "./interfaces/github.repository";
import axios, { AxiosInstance } from "axios";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { ConfigService } from "@nestjs/config";
import { PaginationInput } from "src/common/dto/pagination.dto";

@Injectable()
export class GithubRestRepository implements IGithubRepository {
  private readonly http: AxiosInstance;
  private readonly client: Octokit;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>("GITHUB_TOKEN");
    const githubBaseUrl = this.configService.get<string>("GITHUB_URL");

    if (!token || !githubBaseUrl) throw new Error("Token or URL is not set in env");

    this.http = axios.create({
      baseURL: githubBaseUrl,
      headers: { Authorization: `Bearer ${token}` },
    });

    this.client = new Octokit({ auth: token });
  }

  async fetchRepoList({ limit, offset }: PaginationInput): Promise<RepoDTO[]> {
    try {
      const { data } = await this.client.rest.repos.listForAuthenticatedUser({
        sort: "updated",
        per_page: limit,
        page: offset,
      });

      return data.map((it) => ({
        id: it.id,
        name: it.name,
        size: it.size,
        owner: {
          id: it.owner.id,
          login: it.owner.login,
          url: it.owner.url,
          avatarUrl: it.owner.avatar_url,
        },
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async fetchRepo(
    owner: string,
    repo: string,
  ): Promise<Omit<RepoDetailsDTO, "ymlContent" | "webhooks">> {
    const { data } = await this.client.rest.repos.get({
      owner: owner,
      repo: repo,
    });

    const filesCount = await this.fetchFilesCount(owner, repo, data.default_branch);

    return {
      id: data.id,
      name: data.name,
      size: data.size,
      isPrivate: data.private,
      filesCount: filesCount,
      owner: {
        login: data.owner.login,
        id: data.owner.id,
        avatarUrl: data.owner.avatar_url,
        url: data.owner.url,
      },
    };
  }

  async fetchRepoContents(
    owner: string,
    repo: string,
    path: string,
  ): Promise<RestEndpointMethodTypes["repos"]["getContent"]["response"]["data"]> {
    try {
      const { data } = await this.client.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      return data;
    } catch (err) {
      console.error(err);

      return [];
    }
  }

  async fetchFileContent(downloadUrl: string | null): Promise<string | null> {
    try {
      if (!downloadUrl) {
        throw Error("download url is empty");
      }

      const { data } = await this.http.get<string>(downloadUrl);

      return data;
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async fetchWebhooks(owner: string, repo: string): Promise<Webhook[]> {
    try {
      const { data: webhooks } = await this.client.rest.repos.listWebhooks({
        owner,
        repo,
      });

      return webhooks.map((it) => ({ id: it.id, active: it.active, name: it.name, type: it.type }));
    } catch {
      return [];
    }
  }

  private async fetchFilesCount(
    owner: string,
    repo: string,
    defaultBranch: string,
  ): Promise<number> {
    const { data: commitData } = await this.client.repos.getCommit({
      owner,
      repo,
      ref: defaultBranch,
    });

    const treeSha = commitData.commit.tree.sha;

    const { data: treeData } = await this.client.git.getTree({
      owner,
      repo,
      tree_sha: treeSha,
      recursive: "1",
    });

    return treeData.tree.filter((item) => item.type === "blob").length;
  }
}
