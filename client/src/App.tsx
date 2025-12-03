import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BankAccountsPage from "./pages/BankAccountsPage";
import ThemeToggleFloating from "./components/ThemeToggleFloating";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useState } from "react";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import Layout from "./components/Layout";
declare module "@mui/material/styles" {
  interface Palette {
    auth: {
      left: string;
      right: string;
      field: string;
      textPrimary: string;
      textSecondary: string;
      paper: string;
    };
  }
  interface PaletteOptions {
    auth?: {
      left?: string;
      right?: string;
      field?: string;
      textPrimary?: string;
      textSecondary?: string;
      border?: string;
      placeholder?: string;
      paper?: string;
    };
  }
}


function App() {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const theme = createTheme({
    palette: {
      mode,

      // ---------------------------
      // 🎨 CORES PRINCIPAIS
      // ---------------------------
      primary: {
        main: "#7F56D9",               // roxo principal
        light: "#9E7BEB",              // pastel
        dark: "#6B46C1",
        contrastText: "#FFFFFF",
      },

      secondary: {
        main: "#5F27D8",
        light: "#8254E8",
        dark: "#4B1FAE",
      },

      // ---------------------------
      // 🎨 CORES DE FEEDBACK
      // ---------------------------
      success: {
        main: mode === "dark" ? "#34D399" : "#4ADE80", // verde mais suave
      },
      error: {
        main: mode === "dark" ? "#F87171" : "#EF4444",
      },
      warning: {
        main: mode === "dark" ? "#FBBF24" : "#FACC15",
      },
      info: {
        main: mode === "dark" ? "#60A5FA" : "#3B82F6",
      },

      // ---------------------------
      // 🎨 BACKGROUNDS
      // ---------------------------
      background: {
        default: mode === "dark" ? "#0F172A" : "#F3F4F6",  // ambos pastéis
        paper: mode === "dark" ? "#1E2535" : "#FFFFFF",
      },

      // ---------------------------
      // 🎨 CINZAS BASE / PASTEL
      // ---------------------------
      grey: {
        50: mode === "dark" ? "#F9FAFB" : "#F9FAFB",
        100: mode === "dark" ? "#F3F4F6" : "#F2F4F7",
        200: mode === "dark" ? "#E5E7EB" : "#E4E7EC",
        300: mode === "dark" ? "#D1D5DB" : "#D0D5DD",
        400: mode === "dark" ? "#9CA3AF" : "#98A2B3",
        500: mode === "dark" ? "#6B7280" : "#667085",
        600: mode === "dark" ? "#4B5563" : "#475467",
        700: mode === "dark" ? "#374151" : "#344054",
        800: mode === "dark" ? "#1E293B" : "#1D2939",
        900: mode === "dark" ? "#0F172A" : "#101828",
      },

      // ---------------------------
      // 🔐 AUTH PALETTE (TELA DE LOGIN)
      // ---------------------------
      auth: {
        left: mode === "dark" ? "#26244B" : "#ECEAFF",      // mais pastel
        right: mode === "dark" ? "#101828" : "#FFFFFF",
        field: mode === "dark" ? "#1D2939" : "#F2F4F7",     // claro pastel
        border: mode === "dark" ? "#344054" : "#D0D5DD",
        textPrimary: mode === "dark" ? "#FFFFFF" : "#1D2939",
        textSecondary: mode === "dark" ? "rgba(255,255,255,0.7)" : "#475467",
        placeholder: mode === "dark" ? "#9CA3AF" : "#98A2B3",
        paper: mode === "dark" ? "#1A1935" : "#F4F0FF"
      },

      // ---------------------------
      // ✨ BORDERS / HOVERS / RING
      // ---------------------------
      divider: mode === "dark" ? "rgba(255,255,255,0.1)" : "#E5E7EB",

      action: {
        hover: mode === "dark" ? "rgba(255,255,255,0.08)" : "#EDF2FF",
        selected: mode === "dark" ? "rgba(255,255,255,0.2)" : "#E0EAFF",
        disabledOpacity: 0.4,
        focus: mode === "dark" ? "rgba(127,86,217,0.4)" : "rgba(127,86,217,0.3)"
      },
    },
  });



  const toggleColorMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <ThemeToggleFloating toggleColorMode={toggleColorMode} mode={mode} />

        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="banco" element={<BankAccountsPage />} />
          </Route>
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
