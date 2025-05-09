import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { CircularProgress, Box } from '@mui/material';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import ModuleDetail from './pages/ModuleDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Labs from './pages/Labs';
import LabDetail from './pages/LabDetail';
import Assessments from './pages/Assessments';
import AssessmentDetail from './pages/AssessmentDetail';
import AdminDashboard from './pages/admin/AdminDashboard';

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
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // The auth check is already performed in the AuthContext
    // Just wait for the loading state to be false
    if (!loading) {
      setAppReady(true);
    }
  }, [loading]);

  if (!appReady) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/courses" element={
          <ProtectedRoute>
            <CourseList />
          </ProtectedRoute>
        } />

        <Route path="/courses/:courseId" element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } />

        <Route path="/courses/:courseId/modules/:moduleId" element={
          <ProtectedRoute>
            <ModuleDetail />
          </ProtectedRoute>
        } />

        <Route path="/labs" element={
          <ProtectedRoute>
            <Labs />
          </ProtectedRoute>
        } />

        <Route path="/labs/:labId" element={
          <ProtectedRoute>
            <LabDetail />
          </ProtectedRoute>
        } />

        <Route path="/assessments" element={
          <ProtectedRoute>
            <Assessments />
          </ProtectedRoute>
        } />

        <Route path="/assessments/:assessmentId" element={
          <ProtectedRoute>
            <AssessmentDetail />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
