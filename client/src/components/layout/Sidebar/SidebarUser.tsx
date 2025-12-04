import { Box, Typography, useTheme } from "@mui/material";
import { useAuth } from "../../../hooks/useAuth";

interface Props {
  openProfile: () => void;
}

export default function SidebarUser({ openProfile }: Props) {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        p: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        display: "flex",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: theme.palette.action.hover
        }
      }}
      onClick={openProfile}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.1rem"
        }}
      >
        {user?.email?.charAt(0).toUpperCase() ?? "U"}
      </Box>

      <Box sx={{ overflow: "hidden" }}>
        <Typography variant="subtitle2" noWrap fontWeight="bold">
          {user?.name ?? "Usuário"}
        </Typography>

        <Typography variant="caption" noWrap color="text.secondary">
          {user?.email}
        </Typography>
      </Box>
    </Box>
  );
}
