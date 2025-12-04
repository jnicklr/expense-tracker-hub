import { Box, useTheme } from "@mui/material";
import SidebarHeader from "./SidebarHeader.tsx";
import SidebarMenu from "./SidebarMenu.tsx";
import SidebarUser from "./SidebarUser.tsx";

interface Props {
    openProfile: () => void;
    selectedMenu: string;
    setSelectedMenu: (label: string) => void;
}

export default function Sidebar({ openProfile, selectedMenu, setSelectedMenu }: Props) {
    const theme = useTheme();

    return (
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
                <SidebarHeader />
                <SidebarMenu selectedMenu={selectedMenu}
                    setSelectedMenu={setSelectedMenu} />
            </Box>

            <SidebarUser openProfile={openProfile} />
        </Box>
    );
}
