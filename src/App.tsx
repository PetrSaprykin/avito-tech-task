import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
import ruRU from "antd/locale/ru_RU";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import AdListPage from "./pages/AdListPage";
import AdDetailPage from "./pages/AdDetailPage";
import StatsPage from "./pages/StatsPage";
import Layout from "./components/Layout/Layout";

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm:
          theme === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#00aaff",
          colorSuccess: "#02d15c",
          colorError: "#ff4d4f",
          colorWarning: "#faad14",
          borderRadius: 8,
          fontSize: 14,
        },
      }}
    >
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/list" element={<AdListPage />} />
            <Route path="/item/:id" element={<AdDetailPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/" element={<Navigate to="/list" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
