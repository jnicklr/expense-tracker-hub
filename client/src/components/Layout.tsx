import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Tooltip,
  useTheme
} from "@mui/material";
import {
  Dashboard,
  AccountBalanceWallet,
  TrendingUp,
  Settings,
  ExitToApp,
  AddCard,
  Category,
  Menu as MenuIcon
} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const drawerWidth = 240;

export default function Layout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", icon: <Dashboard />, path: "/banco" },
    { label: "Contas Bancárias", icon: <AddCard />, path: "/accounts" },
    { label: "Transações", icon: <TrendingUp />, path: "/transactions" },
    { label: "Categorias", icon: <Category />, path: "/categories" },
    { label: "Configurações", icon: <Settings />, path: "/settings" }
  ];

  const drawer = (
    <Box
      sx={{
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <Box>
        <Box>
          {/* Branding */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 3,
              py: 2,
            }}
          >
            <AccountBalanceWallet
              fontSize="medium"
              sx={{ color: theme.palette.primary.main }} // Ícone roxo
            />

            <Typography variant="h5" fontWeight="bold">
              FinTrack
            </Typography>
          </Box>

          {/* Linha separadora */}
          <Box
            sx={{
              width: "100%",
              borderBottom: `1px solid ${theme.palette.divider}`,
              mb: 1,
            }}
          />
        </Box>



        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff"
                }
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>

      {/* TOPBAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>

          {/* Mobile menu button */}
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: "none" }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            New Transaction
          </Button>

          <Tooltip title="Deslogar" arrow>
  <IconButton
    onClick={logout}
    sx={{ ml: 1, color: theme.palette.error.main }}
  >
    <ExitToApp />
  </IconButton>
</Tooltip>


        </Toolbar>
      </AppBar>

      {/* SIDEBAR DESKTOP */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth }
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* SIDEBAR MOBILE */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth }
        }}
      >
        {drawer}
      </Drawer>

      {/* CONTEÚDO */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // space after topbar
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh"
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
