import { RestEndpointMethodTypes } from "@octokit/rest";
import { RepoDetailsDTO, Webhook } from "../dto/repo-details.dto";
import { RepoDTO } from "../dto/repo.dto";
import { PaginationInput } from "src/common/dto/pagination.dto";

export interface IGithubRepository {
  fetchRepoList(pagination: PaginationInput): Promise<RepoDTO[]>;
  fetchRepo(
    owner: string,
    repo: string,
  ): Promise<Pick<RepoDetailsDTO, "id" | "size" | "isPrivate" | "name" | "owner">>;
  fetchWebhooks(owner: string, repo: string): Promise<Webhook[]>;
  fetchRepoContents(
    owner: string,
    repo: string,
    path: string,
  ): Promise<RestEndpointMethodTypes["repos"]["getContent"]["response"]["data"]>;
  fetchFileContent(downloadUrl: string | null): Promise<string | null>;
}
