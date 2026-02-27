import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, lazy, Suspense, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProjectProvider } from "./contexts/ProjectContext";
import { ModalProvider } from "./contexts/ModalContext";
import {
  GenerationProvider,
  useGenerationState,
} from "./contexts/GenerationContext";
import BackgroundWave from "./components/BackgroundWave";
import { useTheme } from "./contexts/ThemeContext";

import "./styles/global.scss";

const Home = lazy(() => import("./pages/Home"));

const waveOptions = [
  "hero",
  "cta-0",
  "cta-1",
  "cta-2",
  "cta-3",
  "portfolio",
  "services",
  "footer",
];

function AppContent() {
  const location = useLocation();
  const { setSessionFromHash } = useAuth();
  const { isGenerating } = useGenerationState();
  const { theme } = useTheme();

  useEffect(() => {
    if (location.hash.includes("access_token")) {
      setSessionFromHash(location.hash);
    }
  }, [location, setSessionFromHash]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get("verified");
    if (verified === "true") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="app">
      <Header />
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ProjectProvider>
            <GenerationProvider>
              <ModalProvider>
                <AppContent />
              </ModalProvider>
            </GenerationProvider>
          </ProjectProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
