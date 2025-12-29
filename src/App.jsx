import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, lazy, Suspense, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProjectProvider } from "./contexts/ProjectContext";
import LegalModal from "./components/LegalModal";
import RoadmapModal from "./components/RoadmapModal";
import SupportModal from "./components/SupportModal";
// Use the lazy-loading wrapper instead of direct import
import NoiseBlob from "./components/NoiseBlob";
import "./styles/global.scss";

const Home = lazy(() => import("./pages/Home"));

const PageLoader = () => {
  const { isAuthenticated } = useAuth();

  // Calculate top position based on authentication status
  const topPosition = isAuthenticated ? "var(--header-height, 64px)" : "53px";

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        zIndex: 9999,
        backgroundColor: "transparent",
        pointerEvents: "none",
      }}
    >
      {/* Loading bar stays at calculated position */}
      <div
        style={{
          position: "fixed",
          top: topPosition,
          left: 0,
          width: "100%",
          height: "2px",
          backgroundColor: "var(--color-accent)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "var(--color-accent)",
            animation: "loadingBar 1.5s ease-in-out infinite",
            transformOrigin: "left",
          }}
        />
      </div>

      {/* Rest of container takes up full viewport */}
      <div
        style={{
          height: "100vh",
          width: "100%",
          backgroundColor: "transparent",
        }}
      />
      <style>{`
        @keyframes loadingBar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 70%;
            margin-left: 0%;
          }
          100% {
            width: 100%;
            margin-left: 0%;
          }
        }
      `}</style>
    </div>
  );
};

function AppContent() {
  const location = useLocation();
  const { showResetPassword, setShowResetPassword, setSessionFromHash } =
    useAuth();

  const [showLegal, setShowLegal] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    if (location.hash.includes("access_token")) {
      setSessionFromHash(location.hash);
    }
  }, [location, setSessionFromHash]);

  return (
    <>
      <Header />
      {/* Use the lazy wrapper - shows placeholder immediately, loads Three.js in background */}
      <NoiseBlob />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>

      {/* Pass all handlers to Footer */}
      <Footer
        onLegalClick={() => setShowLegal(true)}
        onRoadmapClick={() => setShowRoadmap(true)}
        onSupportClick={() => setShowSupport(true)}
      />

      {/* Render all modals */}
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
            <ScrollToTop />
            <div className="app">
              <AppContent />
            </div>
          </ProjectProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
