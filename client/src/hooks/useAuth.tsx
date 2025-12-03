// src/context/AuthContext.tsx
import { useState, useEffect, createContext, useContext } from "react";
import { signIn, logout as logoutService } from "../services/loginService";

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const email = localStorage.getItem("user_email");

        if (token && email) {
            setUser({ email });
        }

        setLoading(false);
    }, []);

    async function login(email: string, password: string) {
        const { access_token, refresh_token } = await signIn({
            email,
            password,
        });

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("user_email", email);

        setUser({ email });
    }


    async function logout() {
        const refresh = localStorage.getItem("refresh_token");
        if (refresh) await logoutService(refresh);

        localStorage.clear();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
