import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ResetPasswordModal from "./components/ResetPasswordModal";
import { AuthDebug } from "./components/debug/AuthDebug";

import "./styles/global.scss";

const Home = lazy(() => import("./pages/Home"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Support = lazy(() => import("./pages/Support"));

const PageLoader = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--color-text-secondary)",
    }}
  >
    <div>Loading...</div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
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
    // Check for verification success in URL
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get("verified");

    if (verified === "true") {
      // Show success message
      console.log("Email verified successfully!");
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          {/* <AuthDebug /> */}
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
