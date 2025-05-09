import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { forgotPassword } = useAuth();

  const handleChange = (e) => {
    setEmail(e.target.value);

    // Clear error when user types
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to send password reset email. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Forgot password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Forgot Password
      </Typography>

      {!success ? (
        <>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleChange}
              error={!!error}
              disabled={isSubmitting}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <EmailIcon />}
              sx={{ mt: 3, mb: 2 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </>
      ) : (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Password reset link sent!
          </Typography>
          <Typography variant="body2">
            We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the instructions to reset your password.
          </Typography>
        </Alert>
      )}

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          component={Link}
          to="/login"
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: 'none' }}
        >
          Back to Login
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
