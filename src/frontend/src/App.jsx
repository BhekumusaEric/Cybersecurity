import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { useOffline } from './context/OfflineContext.jsx';
import {
  CircularProgress,
  Box,
  Snackbar,
  Button,
  Alert
} from '@mui/material';

// Common Components
import PageLoader from './components/common/PageLoader';

// Layouts - These are critical for initial render, so we don't lazy load them
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Lazy-loaded Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CourseList = lazy(() => import('./pages/CourseList'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const ModuleDetail = lazy(() => import('./pages/ModuleDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Labs = lazy(() => import('./pages/Labs'));
const LabDetail = lazy(() => import('./pages/LabDetail'));
const Assessments = lazy(() => import('./pages/Assessments'));
const AssessmentDetail = lazy(() => import('./pages/AssessmentDetail'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  const { loading } = useAuth();
  const { isOnline, hasUpdate, updateServiceWorker } = useOffline();
  const [appReady, setAppReady] = useState(false);
  const [offlineAlert, setOfflineAlert] = useState(false);

  useEffect(() => {
    // The auth check is already performed in the AuthContext
    // Just wait for the loading state to be false
    if (!loading) {
      setAppReady(true);
    }
  }, [loading]);

  // Show offline alert when connection status changes
  useEffect(() => {
    if (appReady) {
      setOfflineAlert(!isOnline);
    }
  }, [isOnline, appReady]);

  if (!appReady) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={
            <Suspense fallback={<PageLoader message="Loading login page..." />}>
              <Login />
            </Suspense>
          } />
          <Route path="/register" element={
            <Suspense fallback={<PageLoader message="Loading registration page..." />}>
              <Register />
            </Suspense>
          } />
          <Route path="/forgot-password" element={
            <Suspense fallback={<PageLoader message="Loading password recovery page..." />}>
              <ForgotPassword />
            </Suspense>
          } />
        </Route>

        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader message="Loading dashboard..." />}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/courses" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader message="Loading courses..." />}>
                <CourseList />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/courses/:courseId" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader message="Loading course details..." />}>
                <CourseDetail />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/courses/:courseId/modules/:moduleId" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader message="Loading module content..." />}>
                <ModuleDetail />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/labs" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader message="Loading labs..." />}>
                <Labs />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/labs/:labId" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader message="Loading lab environment..." />}>
                <LabDetail />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/assessments" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader message="Loading assessments..." />}>
                <Assessments />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/assessments/:assessmentId" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader message="Loading assessment..." />}>
                <AssessmentDetail />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader message="Loading profile..." />}>
                <Profile />
              </Suspense>
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <Suspense fallback={<PageLoader message="Loading admin dashboard..." />}>
                <AdminDashboard />
              </Suspense>
            </AdminRoute>
          } />
        </Route>

        {/* 404 route */}
        <Route path="*" element={
          <Suspense fallback={<PageLoader message="Page not found" />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>

      {/* Offline Alert */}
      <Snackbar
        open={offlineAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}
        >
          You are currently offline. Some features may be limited.
        </Alert>
      </Snackbar>

      {/* App Update Alert */}
      <Snackbar
        open={hasUpdate}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message="A new version is available!"
        action={
          <Button color="secondary" size="small" onClick={updateServiceWorker}>
            Update Now
          </Button>
        }
      />
    </>
  );
}

export default App;
