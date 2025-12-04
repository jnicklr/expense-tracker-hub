import { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import type { Theme } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, registerSchema, createUserSchema } from "../schemas/loginSchema";
import { signUp } from "../services/authService";
import { useNavigate } from "react-router-dom";

import AuthLeftPanel from "../components/auth/AuthLeftPanel";
import AuthForm from "../components/auth/AuthForm";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    const { login } = useAuth();
    const navigate = useNavigate();

    async function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        const name = String(form.get("name") || "");
        const email = String(form.get("email"));
        const password = String(form.get("password"));
        const confirmPassword = String(form.get("confirmPassword") || "");

        try {
            if (mode === "login") {
                const parsed = loginSchema.parse({ email, password });
                await login(parsed.email, parsed.password);
                navigate("/dashboard");
            } else {
                const parsed = registerSchema.parse({
                    name,
                    email,
                    password,
                    confirmPassword,
                });

                const payload = createUserSchema.parse(parsed);
                await signUp(payload);

                setSuccessMessage("Conta criada com sucesso!");
                setMode("login");
            }
        } catch (err: any) {
            if (err instanceof Error && "flatten" in err) {
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
    }

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                backgroundColor: (t) => t.palette.auth.right,
            }}
        >
            {!isMobile && <AuthLeftPanel />}

            <AuthForm
                mode={mode}
                setMode={setMode}
                errors={errors}
                submitForm={submitForm}
                successMessage={successMessage}
                errorMessage={errorMessage}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
            />
        </Box>
    );
}
