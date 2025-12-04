import { AppBar, Toolbar, IconButton, Typography, Tooltip, useTheme } from "@mui/material";
import { Menu as MenuIcon, ExitToApp } from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
import ThemeToggleButton from "./ThemeToggleFloating";

interface Props {
  setMobileOpen: (open: boolean) => void;
  selectedMenu: string;
  mode: "light" | "dark";
  toggleColorMode: () => void;
}

export default function Topbar({ setMobileOpen, selectedMenu, mode, toggleColorMode }: Props) {
  const theme = useTheme();
  const { logout } = useAuth();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: "calc(100% - 240px)" },
        ml: { md: "240px" },
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{ display: { md: "none" }, mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1, color: (t) => t.palette.text.primary }}>
          {selectedMenu}
        </Typography>

        <ThemeToggleButton mode={mode} toggleColorMode={toggleColorMode} />

        <Tooltip title="Deslogar" arrow>
          <IconButton
            onClick={logout}
            sx={{ ml: 1, color: theme.palette.primary.main }}
          >
            <ExitToApp />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
