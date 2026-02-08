import { ErrorComponent } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/react-router";
import { Route, Routes } from "react-router";
import { githubRoute } from "../../pages/github";

export const routes = (
  <Routes>
    <Route index element={<NavigateToResource resource="github" />} />
    {githubRoute}
    <Route path="*" element={<ErrorComponent />} />
  </Routes>
);
