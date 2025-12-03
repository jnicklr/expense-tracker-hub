import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BankAccountsPage from "./pages/BankAccountsPage";
import ThemeToggleFloating from "./components/ThemeToggleFloating";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useState } from "react";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
declare module "@mui/material/styles" {
  interface Palette {
    auth: {
      left: string;
      right: string;
      field: string;
      textPrimary: string;
      textSecondary: string;
    };
  }
  interface PaletteOptions {
    auth?: {
      left?: string;
      right?: string;
      field?: string;
      textPrimary?: string;
      textSecondary?: string;
    };
  }
}


function App() {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#7F56D9" : "#7F56D9",
      },
      secondary: {
        main: mode === "dark" ? "#5f27d8" : "#5f27d8",
      },
      background: {
        default: mode === "dark" ? "#0F172A" : "#F4F6F8",
        paper: mode === "dark" ? "#1E2535" : "#FFFFFF",
      },
      auth: {
        left: mode === "dark" ? "#26244B" : "#E9E6FF",
        right: mode === "dark" ? "#101828" : "#FFFFFF",
        field: mode === "dark" ? "#1D2939" : "#EAECF0",
        textPrimary: mode === "dark" ? "#FFFFFF" : "#1D2939",
        textSecondary: mode === "dark" ? "rgba(255,255,255,0.7)" : "#475467",
      }
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
            path="/banco" 
            element={
              <ProtectedRoute>
                <BankAccountsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
