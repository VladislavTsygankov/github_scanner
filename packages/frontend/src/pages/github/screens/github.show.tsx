import { Show, BooleanField, NumberField, MarkdownField } from "@refinedev/mui";
import { useShow } from "@refinedev/core";
import { useLocation, useParams } from "react-router";
import { Avatar, Box, Stack, TextField, Typography } from "@mui/material";
import { RepoDetails } from "../../../entities/github/models/repo.model";
import { REPO_DETAILS_QUERY } from "../../../entities/github/queries";

export const GithubShowScreen = () => {
  const { id } = useParams<{ id: string }>();

  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const owner = params.get("owner")!;
  const repo = params.get("repo")!;

  const {
    result,
    query: { isFetching },
  } = useShow<RepoDetails>({
    resource: "repoDetails",
    id,
    meta: {
      variables: { owner, repos: [repo] },
      gqlQuery: REPO_DETAILS_QUERY,
    },
  });

  return (
    <Show isLoading={isFetching}>
      <Stack spacing={2}>
        <Stack direction="column" spacing={1}>
          <Typography variant="body2" color="textSecondary">
            Name
          </Typography>
          <TextField value={result?.name} />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="textSecondary">
            Size (KB):
          </Typography>
          <NumberField value={result?.size} />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="textSecondary">
            Is Private
          </Typography>
          <BooleanField value={result?.isPrivate} />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="textSecondary">
            Files Count
          </Typography>
          <NumberField value={result?.filesCount} />
        </Stack>

        <Stack direction="column" spacing={1}>
          <Typography variant="body2" color="textSecondary">
            Owner
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              src={result?.owner.avatarUrl}
              alt={result?.owner.login}
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
            <TextField value={result?.owner.login} />
          </Stack>
        </Stack>

        {!!result?.webhooks.length && (
          <Stack>
            <Typography variant="body2" color="textSecondary">
              Webhooks
            </Typography>
            {result.webhooks.map((w) => (
              <TextField value={`${w.name} (${w.type})`} />
            ))}
          </Stack>
        )}

        {result?.ymlContent && (
          <>
            <TextField label="YML File" value={result.ymlContent.name} />
            <Stack>
              <Typography variant="body2" color="textSecondary">
                YML Content
              </Typography>
              <Box
                sx={{
                  maxHeight: 500,
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  p: 1,
                }}>
                <MarkdownField value={result.ymlContent.fileContent} />
              </Box>
            </Stack>
          </>
        )}
      </Stack>
    </Show>
  );
};
