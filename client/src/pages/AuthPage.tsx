import { useState } from "react";
import {
    TextField,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    Box,
    Typography,
    Paper,
    InputAdornment,
    IconButton,
    useMediaQuery
} from "@mui/material";
import type { Theme } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("register");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { login } = useAuth();

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    const handleTogglePassword = (type: "password" | "confirm") => {
        if (type === "password") setShowPassword(prev => !prev);
        else setShowConfirmPassword(prev => !prev);
    };

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        const email = String(form.get("email"));
        const password = String(form.get("password"));
        const confirm = String(form.get("confirmPassword") || "");

        if (mode === "login") {
            await login(email, password);
            window.location.href = "/banco";
        } else {
            console.log("Register:", { email, password, confirm });
        }
    };

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                backgroundColor: (t) => t.palette.auth.right,
                overflow: "hidden"
            }}
        >
            {!isMobile && (
                <Box
                    sx={{
                        flex: 1,
                        height: "100%",
                        backgroundColor: (t) => t.palette.auth.left,
                        color: (t) => t.palette.auth.textPrimary,
                        padding: 6,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center"
                    }}
                >
                    <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ mr: 1, opacity: 0.8 }}
                        >
                            <span style={{ fontSize: "1.2em" }}>[ ]</span>
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                            FinTrack
                        </Typography>
                    </Box>

                    <Typography variant="h5" fontWeight="bold" mb={2}>
                        Your path to financial freedom starts here.
                    </Typography>

                    <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 400 }}>
                        Take control of your finances, track your spending,
                        and achieve your goals with ease.
                    </Typography>

                    <Paper
                        sx={{
                            mt: 6,
                            p: 3,
                            backgroundColor: "#1f1a3a",
                            maxWidth: 450
                        }}
                    >
                        <Typography
                            fontStyle="italic"
                            variant="body2"
                            sx={{ color: "rgba(255,255,255,0.9)" }}
                        >
                            "FinTrack has transformed how I manage my money. It's
                            intuitive, powerful, and has helped me save more than ever before!"
                        </Typography>

                        <Typography
                            textAlign="right"
                            mt={2}
                            variant="caption"
                            sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                            – Alex Johnson, Happy User
                        </Typography>
                    </Paper>
                </Box>
            )}

            <Box
                sx={{
                    flex: 1,
                    height: isMobile ? "100%" : "100%",
                    p: isMobile ? 4 : 6,
                    backgroundColor: (t) => t.palette.auth.right,
                    color: (t) => t.palette.auth.textPrimary,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: "100%"
                }}
            >
                <Box sx={{ width: isMobile ? "100%" : "80%", maxWidth: 450 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {mode === "login" ? "Welcome back" : "Create your account"}
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        sx={{ color: "rgba(255,255,255,0.7)", mb: 4 }}
                    >
                        {mode === "login"
                            ? "Sign in to continue."
                            : "Start taking control of your finances today."}
                    </Typography>

                    <Box
                        sx={{
                            backgroundColor: (t) => t.palette.auth.field,
                            borderRadius: 1.5,
                            p: 0.5,
                            display: "flex",
                            mb: 4,
                            width: "100%"
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
                                    color: (t) => t.palette.auth.textPrimary,
                                    "&.Mui-selected": {
                                        backgroundColor: (t) => t.palette.auth.right,
                                        color: (t) => t.palette.auth.textPrimary,
                                        fontWeight: "bold"
                                    }
                                }
                            }}
                        >
                            <ToggleButton value="login">LOGIN</ToggleButton>
                            <ToggleButton value="register">REGISTER</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={submitForm}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <Typography variant="body2" fontWeight="bold">
                            Email
                        </Typography>
                        <TextField
                            name="email"
                            placeholder="Enter your email"
                            fullWidth
                            InputProps={{
                                sx: {
                                    backgroundColor: (t) => t.palette.auth.field,
                                    color: (t) => t.palette.auth.textPrimary,
                                    "& fieldset": { border: "none" }
                                }
                            }}
                        />

                        <Typography variant="body2" fontWeight="bold">
                            Password
                        </Typography>
                        <TextField
                            name="password"
                            placeholder="Create a password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            InputProps={{
                                sx: {
                                    backgroundColor: (t) => t.palette.auth.field,
                                    color: (t) => t.palette.auth.textPrimary,
                                    "& fieldset": { border: "none" }
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                handleTogglePassword("password")
                                            }
                                            sx={{ color: "rgba(255,255,255,0.7)" }}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        {mode === "register" && (
                            <>
                                <Typography variant="body2" fontWeight="bold">
                                    Confirm Password
                                </Typography>

                                <TextField
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    fullWidth
                                    InputProps={{
                                        sx: {
                                            backgroundColor: (t) => t.palette.auth.field,
                                            color: (t) => t.palette.auth.textPrimary,
                                            "& fieldset": { border: "none" }
                                        },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() =>
                                                        handleTogglePassword("confirm")
                                                    }
                                                    sx={{
                                                        color:
                                                            "rgba(255,255,255,0.7)"
                                                    }}
                                                >
                                                    {showConfirmPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 3,
                                py: 1.5,
                                backgroundColor: (t) => t.palette.primary.main,
                                fontSize: "1rem",
                                fontWeight: "bold",
                                boxShadow: "none",
                                "&:hover": { backgroundColor: (t) => t.palette.secondary.main }
                            }}
                        >
                            {mode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
