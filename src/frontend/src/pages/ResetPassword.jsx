import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockReset as LockResetIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setSubmitError('Invalid or missing reset token');
    }

    // In a real app, you would verify the token with the backend
    // For now, we'll just check if it's a non-empty string
    if (typeof token !== 'string' || token.length < 10) {
      setTokenValid(false);
      setSubmitError('Invalid reset token');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    // Clear submit error when user makes any change
    if (submitError) {
      setSubmitError('');
    }
  };

  const toggleShowPassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await resetPassword(token, formData.password);

      if (result.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setSubmitError(result.error || 'Password reset failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tokenValid) {
    return (
      <Box sx={{ width: '100%' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError || 'Invalid or expired reset token'}
        </Alert>
        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={Link}
            to="/forgot-password"
            variant="contained"
            color="primary"
          >
            Request New Reset Link
          </Button>
        </Box>
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Password reset successful!
          </Typography>
          <Typography variant="body2">
            Your password has been reset. You will be redirected to the login page.
          </Typography>
        </Alert>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          color="primary"
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Reset Password
      </Typography>

      <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
        Enter your new password below
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          type={showPassword.password ? 'text' : 'password'}
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          disabled={isSubmitting}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => toggleShowPassword('password')}
                  edge="end"
                >
                  {showPassword.password ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm New Password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="confirmPassword"
          type={showPassword.confirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          disabled={isSubmitting}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => toggleShowPassword('confirmPassword')}
                  edge="end"
                >
                  {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <LockResetIcon />}
          sx={{ mt: 3, mb: 2 }}
        >
          {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
        </Button>
      </form>
    </Box>
  );
};

export default ResetPassword;
