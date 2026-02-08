import { Route } from "react-router";
import { GithubListScreen } from "./screens/github.list";
import { GithubShowScreen } from "./screens/github.show";

export const githubRoute = (
  <Route path="/github">
    <Route index element={<GithubListScreen />} />
    <Route path="show/:id" element={<GithubShowScreen />} />
  </Route>
);
