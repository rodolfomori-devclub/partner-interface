import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/common/LoadingScreen';
import { isLowPerformanceDevice, prefersReducedMotion } from './utils/performanceUtils';

// Lazy load das páginas para melhorar performance inicial
const HomePage = lazy(() => import('./pages/HomePage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const NearbyPage = lazy(() => import('./pages/NearbyPage')); // Nova página

function App() {
  // Configurações para acelerar a UI com base no dispositivo
  useEffect(() => {
    // Verificar se dispositivo é de baixo desempenho
    const isLowPerf = isLowPerformanceDevice();
    
    // Verificar se o usuário prefere redução de movimento
    const reduceMotion = prefersReducedMotion();
    
    // Definir classe CSS para ajustar animações com base no dispositivo
    if (isLowPerf || reduceMotion) {
      document.documentElement.classList.add('reduce-animations');
    }
    
    // Pré-carregar as páginas mais importantes após o carregamento inicial
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        // Pré-carregar RegisterPage durante tempo ocioso
        import('./pages/RegisterPage');
        import('./pages/SearchPage');
        import('./pages/NearbyPage');
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-secondary text-gray-900 dark:text-gray-100">
            <Header />
            <main className="flex-grow">
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/nearby" element={<NearbyPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#051626',
                  color: '#fff',
                  border: '1px solid #37E359',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
                // Reduzir animações para melhor performance
                className: 'toast-optimize',
                success: {
                  style: {
                    border: '1px solid #37E359',
                    background: '#051626',
                  },
                  iconTheme: {
                    primary: '#37E359',
                    secondary: '#FFFFFF',
                  }
                },
                error: {
                  style: {
                    border: '1px solid #EF4444',
                    background: '#051626',
                  },
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFFFFF',
                  }
                }
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;