import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth/AuthContext';
import { ThemeProvider } from './features/settings/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './features/landing/LandingPage';
import { AuthPage } from './features/auth/AuthPage';
import { SchedulesPage } from './features/schedules/SchedulesPage';
import { BuilderPage } from './features/generator/BuilderPage';
import { OfferingsPage } from './features/offerings/OfferingsPage';
import { SettingsPage } from './features/settings/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Landing / Homepage before entering the workspace */}
                <Route path="/" element={<LandingPage />} />

                {/* Workspace Application routes */}
                <Route element={<AppLayout />}>
                  <Route path="/schedules" element={<SchedulesPage />} />
                  <Route path="/builder" element={<BuilderPage />} />
                  <Route path="/offerings" element={<OfferingsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Optional authentication page */}
                <Route path="/auth" element={<AuthPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
