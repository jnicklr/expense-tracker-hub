import { useState, useEffect, createContext, useContext } from "react";
import { signIn, logout as logoutService } from "../services/authService";
import { getProfileInfo } from "../services/userService";
import type { User } from "../types/user"

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (u: User | null) => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Carrega usuário quando recarregar página
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setLoading(false);
            return;
        }

        getProfileInfo()
            .then(setUser)
            .finally(() => setLoading(false));
    }, []);

    async function login(email: string, password: string) {
        const { access_token, refresh_token } = await signIn({ email, password });

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        // Buscar dados reais
        const userData = await getProfileInfo();
        setUser(userData);
    }

    async function logout() {
        const refresh = localStorage.getItem("refresh_token");
        if (refresh) await logoutService(refresh);

        localStorage.clear();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
