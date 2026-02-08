import {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetOneParams,
  GetOneResponse,
} from "@refinedev/core/dist";
import { GraphQLClient } from "@refinedev/graphql";

export const API_URL =
  process.env.NODE_ENV === "production"
    ? `${import.meta.env.VITE_API_URL}`
    : "http://localhost:5000/graphql";

const client = new GraphQLClient(API_URL);

const createDataProvider = (client: GraphQLClient): DataProvider => {
  return {
    getList: async <TData extends BaseRecord = BaseRecord>({
      pagination,
      meta,
      resource,
    }: GetListParams) => {
      const page = pagination?.currentPage ?? 1;
      const limit = pagination?.pageSize ?? 10;

      const { gqlQuery } = meta ?? {};

      if (!gqlQuery) {
        throw new Error("meta.gqlQuery is required");
      }

      const res = await client.request<Record<string, TData[]>>(gqlQuery, {
        limit,
        offset: (page - 1) * limit,
      });

      const data = res[resource];

      return {
        data,
        total: data.length,
      };
    },

    getApiUrl() {
      throw new Error("Not implemented");
    },

    // Остальные методы можно пока оставить пустыми
    getOne: async <TData extends BaseRecord = BaseRecord>(
      params: GetOneParams,
    ): Promise<GetOneResponse<TData>> => {
      const { meta, resource } = params;

      const { gqlQuery } = meta ?? {};

      if (!gqlQuery) {
        throw new Error("meta.gqlQuery is required");
      }

      const res = await client.request<Record<string, TData[]>>(gqlQuery, { ...meta?.variables });

      return { data: res[resource][0] };
    },
    create: async () => {
      throw new Error("Not implemented");
    },
    update: async () => {
      throw new Error("Not implemented");
    },
    deleteOne: async () => {
      throw new Error("Not implemented");
    },
  };
};

export const dataProvider = createDataProvider(client);
