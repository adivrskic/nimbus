import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import './styles/global.scss';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Support = lazy(() => import('./pages/Support'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Loading component
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-secondary)'
  }}>
    <div></div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ScrollToTop />
          <div className="app">
            <Header />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                ...
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;