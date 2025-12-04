import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ResetPasswordModal from "./components/ResetPasswordModal";

import "./styles/global.scss";

const Home = lazy(() => import("./pages/Home"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Support = lazy(() => import("./pages/Support"));
const Legal = lazy(() => import("./pages/Legal"));

const PageLoader = () => (
  <div
    style={{
      position: "fixed",
      top: "var(--header-height, 64px)",
      left: 0,
      width: "100%",
      height: "2px",
      backgroundColor: "var(--color-accent)",
      zIndex: 9999,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: "100%",
        backgroundColor: "var(--color-primary, #6366f1)",
        animation: "loadingBar 1.5s ease-in-out infinite",
        transformOrigin: "left",
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

function AppContent() {
  const location = useLocation();
  const { showResetPassword, setShowResetPassword, setSessionFromHash } =
    useAuth();

  useEffect(() => {
    if (location.hash.includes("access_token")) {
      setSessionFromHash(location.hash);
    }
  }, [location, setSessionFromHash]);

  return (
    <>
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/support" element={<Support />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </Suspense>
      <Footer />
      <ResetPasswordModal
        isOpen={showResetPassword}
        onClose={() => setShowResetPassword(false)}
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
          <ScrollToTop />
          <div className="app">
            <AppContent />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
