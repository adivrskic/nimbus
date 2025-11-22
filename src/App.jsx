import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
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
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ScrollToTop />
          <div className="app">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home theme={theme} />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/support" element={<Support />} />
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