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
import LegalModal from "./components/Modals/LegalModal";
import RoadmapModal from "./components/Modals/RoadmapModal";
import SupportModal from "./components/Modals/SupportModal";
import {
  GenerationProvider,
  useGenerationState,
} from "./contexts/GenerationContext";
import NoiseBlob from "./components/NoiseBlob";
import { useTheme } from "./contexts/ThemeContext";

import "./styles/global.scss";

const Home = lazy(() => import("./pages/Home"));

function AppContent() {
  const location = useLocation();
  const { setSessionFromHash } = useAuth();
  const { isGenerating } = useGenerationState();

  const [showLegal, setShowLegal] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (location.hash.includes("access_token")) {
      setSessionFromHash(location.hash);
    }
  }, [location, setSessionFromHash]);

  return (
    <>
      <Header />
      <NoiseBlob isGenerating={isGenerating} isDark={theme === "dark"} />
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>

      <Footer
        onLegalClick={() => setShowLegal(true)}
        onRoadmapClick={() => setShowRoadmap(true)}
        onSupportClick={() => setShowSupport(true)}
      />

      <LegalModal isOpen={showLegal} onClose={() => setShowLegal(false)} />
      <RoadmapModal
        isOpen={showRoadmap}
        onClose={() => setShowRoadmap(false)}
      />
      <SupportModal
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
      />
    </>
  );
}

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get("verified");

    if (verified === "true") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ProjectProvider>
            <GenerationProvider>
              <div className="app">
                <AppContent />
              </div>
            </GenerationProvider>
          </ProjectProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
