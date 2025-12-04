import { List, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import { Dashboard, AddCard, TrendingUp, Category } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Props {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
}

export default function SidebarMenu({ selectedMenu, setSelectedMenu }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", icon: <Dashboard />, path: "/banco" },
    { label: "Contas Bancárias", icon: <AddCard />, path: "/accounts" },
    { label: "Transações", icon: <TrendingUp />, path: "/transactions" },
    { label: "Categorias", icon: <Category />, path: "/categories" }
  ];

  return (
    <List>
      {menuItems.map((item) => (
        <ListItemButton
          key={item.label}
          selected={selectedMenu === item.label}
          onClick={() => {
            setSelectedMenu(item.label);
            navigate(item.path);
          }}
          sx={{
            borderRadius: 1,
            mx: 1,
            mb: 1,
            "&.Mui-selected": {
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
            },
            "&.Mui-selected:hover": {
              backgroundColor: theme.palette.primary.dark,
            }
          }}
        >
          <ListItemIcon
            sx={{
              color: selectedMenu === item.label
                ? "#fff"
                : theme.palette.text.primary,
            }}
          >
            {item.icon}
          </ListItemIcon>

          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );
}
