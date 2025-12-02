import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BankAccountsPage from "./pages/BankAccountsPage";
// import Login from "./pages/LoginPage";
// import Home from "./pages/HomePage";
import ThemeToggleFloating from "./components/ThemeToggleFloating";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useState } from "react";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = createTheme({ palette: { mode } });

  const toggleColorMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeToggleFloating toggleColorMode={toggleColorMode} mode={mode} />
      <Router>
        <Routes>
          <Route path="/" element={<BankAccountsPage />} />
          {/* <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;