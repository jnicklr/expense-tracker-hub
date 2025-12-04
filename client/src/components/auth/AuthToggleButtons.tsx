import { ToggleButtonGroup, ToggleButton, Box } from "@mui/material";

interface Props {
  mode: "login" | "register";
  setMode: (v: "login" | "register") => void;
}

export default function AuthToggleButtons({ mode, setMode }: Props) {
  return (
    <Box
      sx={{
        backgroundColor: (t) => t.palette.auth.field,
        borderRadius: 1.5,
        p: 0.5,
        mb: 4,
        width: "100%",
      }}
    >
      <ToggleButtonGroup
        fullWidth
        exclusive
        value={mode}
        onChange={(_, val) => val && setMode(val)}
        sx={{
          "& .MuiToggleButtonGroup-grouped": {
            border: "none",
            mx: 0.5,
            my: 0.5,
            borderRadius: 1.5,
            "&.Mui-selected": {
              backgroundColor: (t) => t.palette.auth.right,
              fontWeight: "bold",
            },
          },
        }}
      >
        <ToggleButton value="login">LOGIN</ToggleButton>
        <ToggleButton value="register">CADASTRO</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
