import { Outlet, Navigate } from 'react-router-dom';
import { Box, Paper, Container, Typography, useTheme } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import SecurityIcon from '@mui/icons-material/Security';

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const theme = useTheme();

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <SecurityIcon 
            color="primary" 
            sx={{ 
              fontSize: 60, 
              mb: 2 
            }} 
          />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: 'bold' }}
          >
            Ethical Hacking Course
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            sx={{ mb: 4 }}
          >
            Professional Cybersecurity Training
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <Outlet />
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            &copy; {new Date().getFullYear()} Ethical Hacking Course. All rights reserved.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Secure. Professional. Ethical.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;
