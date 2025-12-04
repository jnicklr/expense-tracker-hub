import { Box, Drawer } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import Sidebar from "./Sidebar/Sidebar.tsx";
import Topbar from "./Topbar/Topbar.tsx";
import UserProfile from "./UserProfile/UserProfile.tsx";

const drawerWidth = 240;

interface LayoutProps {
  mode: "light" | "dark";
  toggleColorMode: () => void;
}

export default function Layout({ mode, toggleColorMode }: LayoutProps) {
    const { user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState("Dashboard");

    return (
        <Box sx={{ display: "flex" }}>
            <Topbar setMobileOpen={setMobileOpen} selectedMenu={selectedMenu} mode={mode}  toggleColorMode={toggleColorMode}/>

            {/* Desktop Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    display: { xs: "none", md: "block" },
                    "& .MuiDrawer-paper": { width: drawerWidth }
                }}
                open
            >
                <Sidebar
                    openProfile={() => setOpenProfileModal(true)}
                    selectedMenu={selectedMenu}
                    setSelectedMenu={setSelectedMenu}
                />
            </Drawer>

            {/* Mobile Sidebar */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": { width: drawerWidth }
                }}
            >
                <Sidebar
                    openProfile={() => setOpenProfileModal(true)}
                    selectedMenu={selectedMenu}
                    setSelectedMenu={setSelectedMenu}
                />
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    minHeight: "100vh"
                }}
            >
                <Outlet />

                <UserProfile
                    openProfileModal={openProfileModal}
                    setOpenProfileModal={setOpenProfileModal}
                    user={user}
                />
            </Box>
        </Box>
    );
}
