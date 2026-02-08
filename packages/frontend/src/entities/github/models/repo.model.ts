import { Owner } from "./owner.model";
import { Webhook } from "./webhook.model";
import { YmlContent } from "./ymlContent.model";

export interface Repo {
  id: number;
  name: string;
  size: number;
  owner: Owner;
}

export interface RepoDetails extends Repo {
  webhooks: Webhook[];
  ymlContent: YmlContent;
  isPrivate: boolean;
  filesCount: number;
}
