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
    useMediaQuery,
    Alert
} from "@mui/material";
import type { Theme } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, registerSchema, createUserSchema } from "../schemas/loginSchema";
import { signUp } from "../services/loginService";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("register");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const { login } = useAuth();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    const handleTogglePassword = (type: "password" | "confirm") => {
        if (type === "password") setShowPassword(prev => !prev);
        else setShowConfirmPassword(prev => !prev);
    };

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        const name = String(form.get("name") || "");
        const email = String(form.get("email"));
        const password = String(form.get("password"));
        const confirmPassword = String(form.get("confirmPassword") || "");

        try {
            if (mode === "login") {
                const data = loginSchema.parse({ email, password });
                await login(data.email, data.password);
                navigate("/banco");
            } else {
                const parsed = registerSchema.parse({
                    name,
                    email,
                    password,
                    confirmPassword
                });

                const data = createUserSchema.parse(parsed);

                await signUp(data);

                setSuccessMessage("Conta criada com sucesso!");

                setMode("login");
            }
        } catch (err) {
            if (err instanceof Error && "flatten" in err) {
                // Erros do Zod
                const zodErr = (err as any).flatten().fieldErrors;
                const flat: Record<string, string> = {};

                Object.entries(zodErr).forEach(([key, val]) => {
                    const messages = val as string[] | undefined;
                    if (messages && messages.length > 0) {
                        flat[key] = messages[0];
                    }
                });

                setErrors(flat);
            } else {
                setErrorMessage("Erro inesperado")
            }
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

                    <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 400, color: (t) => t.palette.auth.textSecondary, }}>
                        Take control of your finances, track your spending,
                        and achieve your goals with ease.
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
                            maxWidth: 450
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
                            "FinTrack has transformed how I manage my money. It's
                            intuitive, powerful, and has helped me save more than ever before!"
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
                        sx={{
                            color: (t) =>
                                t.palette.mode === "dark"
                                    ? "rgba(255,255,255,0.6)"
                                    : t.palette.auth.textSecondary, mb: 4
                        }}
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

                    {successMessage && (
                        <Alert
                            severity="success"
                            onClose={() => setSuccessMessage(null)}
                            sx={{ mb: 2 }}
                        >
                            {successMessage}
                        </Alert>
                    )}
                    {errorMessage && (
                        <Alert
                            severity="error"
                            onClose={() => setErrorMessage(null)}
                            sx={{ mb: 2 }}
                        >
                            {errorMessage}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={submitForm}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        {mode === "register" && (
                            <>
                                <Typography variant="body2" fontWeight="bold">
                                    Name
                                </Typography>
                                <TextField
                                    name="name"
                                    placeholder="Your name"
                                    fullWidth
                                    error={Boolean(errors.name)}
                                    helperText={errors.name}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: (t) => t.palette.auth.field,
                                            "& fieldset": { border: "none" }
                                        }
                                    }}
                                />''
                            </>
                        )}

                        <Typography variant="body2" fontWeight="bold">
                            Email
                        </Typography>
                        <TextField
                            name="email"
                            placeholder="Enter your email"
                            fullWidth
                            error={Boolean(errors.email)}
                            helperText={errors.email}
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
                            error={Boolean(errors.password)}
                            helperText={errors.password}
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
                                    error={Boolean(errors.confirmPassword)}
                                    helperText={errors.confirmPassword}
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
