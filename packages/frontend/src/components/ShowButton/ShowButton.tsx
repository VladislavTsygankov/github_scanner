import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigation } from "@refinedev/core";

interface ShowButtonProps {
  entityId: number;
  resource: string;
  query?: Record<string, string>;
}

export const ShowButton = ({ entityId, resource, query }: ShowButtonProps) => {
  const { show } = useNavigation();

  return (
    <IconButton onClick={() => show(resource, entityId, "push", { query })}>
      <VisibilityIcon />
    </IconButton>
  );
};
