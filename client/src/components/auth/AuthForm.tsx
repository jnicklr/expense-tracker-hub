import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import AuthToggleButtons from "./AuthToggleButtons";
import AuthAlerts from "./AuthAlerts";

import { useState } from "react";

interface Props {
  mode: "login" | "register";
  setMode: (v: "login" | "register") => void;
  errors: Record<string, string>;
  submitForm: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  successMessage: string | null;
  errorMessage: string | null;
  setSuccessMessage: (v: string | null) => void;
  setErrorMessage: (v: string | null) => void;
}

export default function AuthForm(props: Props) {
  const {
    mode,
    setMode,
    errors,
    submitForm,
    successMessage,
    errorMessage,
    setSuccessMessage,
    setErrorMessage,
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Box
      sx={{
        flex: 1,
        p: 6,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 450 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ mb: 4, color: (t) => t.palette.auth.textSecondary }}
        >
          {mode === "login"
            ? "Sign in to continue."
            : "Start taking control of your finances today."}
        </Typography>

        <AuthToggleButtons mode={mode} setMode={setMode} />

        <AuthAlerts
          successMessage={successMessage}
          errorMessage={errorMessage}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
        />

        <Box component="form" onSubmit={submitForm} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {mode === "register" && (
            <TextField
              name="name"
              placeholder="Your name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
          )}

          <TextField
            name="email"
            placeholder="Enter your email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            name="password"
            placeholder="Create a password"
            type={showPassword ? "text" : "password"}
            fullWidth
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((p) => !p)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {mode === "register" && (
            <TextField
              name="confirmPassword"
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((p) => !p)}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1.5, fontWeight: "bold" }}
          >
            {mode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
