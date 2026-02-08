import gql from "graphql-tag";

export const REPO_LIST_QUERY = gql`
  query ListRepos($limit: Int!, $offset: Int!) {
    listRepos(pagination: { limit: $limit, offset: $offset }) {
      id
      name
      size
      owner {
        login
      }
    }
  }
`;
