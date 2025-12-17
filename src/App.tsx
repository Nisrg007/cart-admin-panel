import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AlertProvider } from './contexts/AlertContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Carts } from './pages/Carts';
import { Alerts } from './pages/Alerts';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { LiveMap } from './pages/LiveMap';

// Component to handle initial page load
const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Prevent any direct API calls to root path
    if (location.pathname === '/') {
      console.log('App initialized at root path');
    }
  }, [location]);

  return <>{children}</>;
};

// Main layout for authenticated users
const AuthenticatedLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <ErrorBoundary>
            <AppInitializer>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/map" element={<LiveMap />} />
                <Route path="/carts" element={<Carts />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppInitializer>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

// Router component that handles authentication-based routing
const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hocco-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {isAuthenticated ? (
        <Route path="/*" element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        } />
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AlertProvider>
            <AppRouter />
          </AlertProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;