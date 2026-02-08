import gql from "graphql-tag";

export const REPO_DETAILS_QUERY = gql`
  query RepoDetails($owner: String!, $repos: [String!]!) {
    repoDetails(owner: $owner, repos: $repos) {
      filesCount
      id
      isPrivate
      name
      size
      owner {
        avatarUrl
        id
        login
        url
      }
      webhooks {
        active
        id
        name
        type
      }
      ymlContent {
        fileContent
        name
        path
        size
        url
      }
    }
  }
`;
