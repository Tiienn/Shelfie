import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './store/slices/authSlice';
import { useAppStore } from './store/slices/appSlice';
import { useSyncManager } from './hooks/useSyncManager';
import { useInstallPrompt } from './hooks/useInstallPrompt';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Loading Components
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { InstallPrompt } from './components/common/InstallPrompt';

// Lazy-loaded pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const PantryPage = React.lazy(() => import('./pages/PantryPage'));
const ScannerPage = React.lazy(() => import('./pages/ScannerPage'));
const RecipesPage = React.lazy(() => import('./pages/RecipesPage'));
const GroceryPage = React.lazy(() => import('./pages/GroceryPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

// Auth pages
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));

// Error pages
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { isOnline, theme } = useAppStore();
  const { isInstallable, showPrompt, hidePrompt } = useInstallPrompt();

  // Initialize sync manager
  useSyncManager();

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Show loading screen while authentication is being determined
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Global Components */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'dark:bg-gray-800 dark:text-white',
        }}
      />
      <OfflineIndicator isOnline={isOnline} />
      {isInstallable && <InstallPrompt onInstall={showPrompt} onDismiss={hidePrompt} />}

      <Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="large" />
          </div>
        }
      >
        <Routes>
          {/* Authentication Routes */}
          {!isAuthenticated ? (
            <Route path="/*" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
          ) : (
            /* Authenticated Routes */
            <Route path="/*" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="pantry/*" element={<PantryPage />} />
              <Route path="scanner" element={<ScannerPage />} />
              <Route path="recipes/*" element={<RecipesPage />} />
              <Route path="grocery/*" element={<GroceryPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          )}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;