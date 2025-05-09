import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  Link as MuiLink,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const val = name === 'agreeTerms' ? checked : value;

    setFormData({ ...formData, [name]: val });

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

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

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    console.log('Submitting registration with data:', formData);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      console.log('Registration result:', result);

      if (result.success) {
        console.log('Registration successful, setting success state');
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          console.log('Redirecting to login page');
          navigate('/login');
        }, 2000);
      } else {
        console.log('Registration failed:', result.error);
        setSubmitError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Registration successful! You will be redirected to the login page.
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
        Create an Account
      </Typography>

      <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
        Join our ethical hacking community and start learning
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="name"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          disabled={isSubmitting}
          required
        />

        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          margin="normal"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          disabled={isSubmitting}
          required
        />

        <TextField
          label="Password"
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
          label="Confirm Password"
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

        <FormControlLabel
          control={
            <Checkbox
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              color="primary"
              disabled={isSubmitting}
            />
          }
          label={
            <Typography variant="body2">
              I agree to the{' '}
              <MuiLink component={Link} to="/terms" underline="hover">
                Terms and Conditions
              </MuiLink>{' '}
              and{' '}
              <MuiLink component={Link} to="/privacy" underline="hover">
                Privacy Policy
              </MuiLink>
            </Typography>
          }
          sx={{ mt: 2 }}
        />
        {errors.agreeTerms && (
          <Typography variant="caption" color="error">
            {errors.agreeTerms}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
          sx={{ mt: 3, mb: 2 }}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="textSecondary">
          OR
        </Typography>
      </Divider>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <MuiLink
            component={Link}
            to="/login"
            variant="body2"
            underline="hover"
            fontWeight="bold"
          >
            Log In
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
