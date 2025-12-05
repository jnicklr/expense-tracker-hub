import { Box, Typography, useTheme } from "@mui/material";
import { AccountBalanceWallet } from "@mui/icons-material";

export default function SidebarHeader() {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 2
        }}
      >
        <AccountBalanceWallet
          fontSize="medium"
          sx={{ color: theme.palette.primary.main }}
        />
        <Typography variant="h6" fontWeight="bold">
          ExpenseTracker
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 1
        }}
      />
    </>
  );
}
