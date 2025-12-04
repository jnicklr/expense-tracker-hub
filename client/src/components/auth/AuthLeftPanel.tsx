import { Box, Typography, Paper } from "@mui/material";

export default function AuthLeftPanel() {
  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: (t) => t.palette.auth.left,
        color: (t) => t.palette.auth.textPrimary,
        padding: 6,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mr: 1, opacity: 0.8 }}>
          <span style={{ fontSize: "1.2em" }}>[ ]</span>
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          FinTrack
        </Typography>
      </Box>

      <Typography variant="h5" fontWeight="bold" mb={2}>
        Your path to financial freedom starts here.
      </Typography>

      <Typography
        variant="body1"
        sx={{
          opacity: 0.8,
          maxWidth: 400,
          color: (t) => t.palette.auth.textSecondary,
        }}
      >
        Take control of your finances, track your spending, and achieve your
        goals with ease.
      </Typography>

      <Paper
        sx={{
          mt: 6,
          p: 3,
          backgroundColor: (t) => t.palette.auth.paper,
          boxShadow: (t) =>
            t.palette.mode === "dark"
              ? "0px 2px 12px rgba(0,0,0,0.3)"
              : "0px 1px 8px rgba(0,0,0,0.1)",
          maxWidth: 450,
        }}
      >
        <Typography
          fontStyle="italic"
          variant="body2"
          sx={{
            color: (t) =>
              t.palette.mode === "dark"
                ? "rgba(255,255,255,0.9)"
                : t.palette.auth.textPrimary,
          }}
        >
          "FinTrack transformed how I manage my money. It's intuitive, powerful,
          and helped me save more than ever!"
        </Typography>

        <Typography
          textAlign="right"
          mt={2}
          variant="caption"
          sx={{
            color: (t) =>
              t.palette.mode === "dark"
                ? "rgba(255,255,255,0.6)"
                : t.palette.auth.textSecondary,
          }}
        >
          – Alex Johnson
        </Typography>
      </Paper>
    </Box>
  );
}
