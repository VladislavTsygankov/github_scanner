import { List, useDataGrid } from "@refinedev/mui";
import { Repo } from "../../../entities/github/models/repo.model";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ShowButton } from "../../../components/ShowButton/ShowButton";
import { Owner } from "../../../entities/github/models/owner.model";
import { REPO_LIST_QUERY } from "../../../entities/github/queries";

export const GithubListScreen = () => {
  const { dataGridProps } = useDataGrid<Repo>({
    resource: "listRepos",
    pagination: { currentPage: 1, pageSize: 25 },
    meta: {
      gqlQuery: REPO_LIST_QUERY,
    },
  });

  const columns: GridColDef<Repo>[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 300,
      flex: 1,
      filterable: false,
      sortable: false,
      hideable: false,
    },
    {
      field: "size",
      headerName: "Size",
      minWidth: 120,
      flex: 0.3,
      filterable: false,
      sortable: false,
      hideable: false,
    },
    {
      field: "owner",
      headerName: "Owner",
      minWidth: 300,
      flex: 1,
      filterable: false,
      sortable: false,
      hideable: false,
      valueGetter: (param: Owner) => {
        return param.login;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      minWidth: 80,
      getActions: ({ row }) => [
        <ShowButton
          entityId={row.id}
          resource="github"
          query={{ owner: row.owner.login, repo: row.name }}
        />,
      ],
    },
  ];

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        getRowId={(row) => row.id}
        columns={columns}
        hideFooterPagination={false}
      />
    </List>
  );
};
