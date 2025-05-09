import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Alert,
  AlertTitle,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  Verified as VerifiedIcon,
  Cancel as CancelIcon,
  EmojiEvents as EmojiEventsIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const VerifyCertificate = () => {
  const { certificateNumber } = useParams();
  const navigate = useNavigate();
  
  const [searchInput, setSearchInput] = useState(certificateNumber || '');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Verify certificate if number is provided in URL
  useEffect(() => {
    if (certificateNumber) {
      verifyCertificate(certificateNumber);
    }
  }, [certificateNumber]);
  
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!searchInput.trim()) {
      setError('Please enter a certificate number');
      return;
    }
    
    // Update URL with certificate number
    navigate(`/verify/${searchInput}`);
    
    // Verify certificate
    verifyCertificate(searchInput);
  };
  
  const verifyCertificate = async (number) => {
    try {
      setLoading(true);
      setError(null);
      setVerificationResult(null);
      
      // In a real app, this would be an API call
      // For now, we'll simulate with setTimeout and mock data
      setTimeout(() => {
        // Mock verification result
        if (number === 'CERT-12345678' || number === 'CERT-87654321') {
          setVerificationResult({
            valid: true,
            certificate: {
              id: '1',
              certificateNumber: number,
              issueDate: '2023-05-15T10:30:00Z',
              status: 'active',
              user: {
                name: 'John Doe'
              },
              course: {
                title: 'Ethical Hacking Fundamentals',
                level: 'beginner'
              }
            }
          });
        } else if (number === 'CERT-ABCDEF12') {
          setVerificationResult({
            valid: false,
            message: 'Certificate has expired',
            certificate: {
              id: '3',
              certificateNumber: number,
              issueDate: '2023-04-10T09:15:00Z',
              expiryDate: '2023-07-10T09:15:00Z',
              status: 'expired',
              user: {
                name: 'John Doe'
              },
              course: {
                title: 'Web Application Security',
                level: 'intermediate'
              }
            }
          });
        } else {
          setVerificationResult({
            valid: false,
            message: 'Certificate not found'
          });
        }
        
        setLoading(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setError('Failed to verify certificate. Please try again.');
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Certificate Verification
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Verify the authenticity of certificates issued by our platform
      </Typography>
      
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Enter Certificate ID
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Certificate ID"
              variant="outlined"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="e.g. CERT-12345678"
              error={!!error}
              helperText={error}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              disabled={loading}
              sx={{ height: '56px' }}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {verificationResult && (
        <Box sx={{ mt: 4 }}>
          {verificationResult.valid ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              <AlertTitle>Valid Certificate</AlertTitle>
              This certificate is authentic and has been issued by our platform.
            </Alert>
          ) : (
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Invalid Certificate</AlertTitle>
              {verificationResult.message || 'This certificate could not be verified.'}
            </Alert>
          )}
          
          {verificationResult.certificate && (
            <Card>
              <Grid container>
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3,
                    bgcolor: verificationResult.valid ? 'success.light' : 'error.light',
                    color: 'white'
                  }}>
                    {verificationResult.valid ? (
                      <VerifiedIcon sx={{ fontSize: 80, mb: 2 }} />
                    ) : (
                      <CancelIcon sx={{ fontSize: 80, mb: 2 }} />
                    )}
                    
                    <Typography variant="h6" align="center">
                      {verificationResult.valid ? 'Verified' : 'Not Verified'}
                    </Typography>
                    
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                      Certificate ID:
                    </Typography>
                    <Typography variant="body1" align="center" fontWeight="bold">
                      {verificationResult.certificate.certificateNumber}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Certificate Details
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Recipient
                          </Typography>
                          <Typography variant="body1">
                            {verificationResult.certificate.user.name}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SchoolIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Course
                          </Typography>
                          <Typography variant="body1">
                            {verificationResult.certificate.course.title}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={verificationResult.certificate.course.level.charAt(0).toUpperCase() + verificationResult.certificate.course.level.slice(1)} 
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Issue Date
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(verificationResult.certificate.issueDate)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {verificationResult.certificate.expiryDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ mr: 2, color: 'warning.main' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Expiry Date
                            </Typography>
                            <Typography variant="body1">
                              {formatDate(verificationResult.certificate.expiryDate)}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmojiEventsIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Status
                          </Typography>
                          <Chip 
                            label={verificationResult.certificate.status.charAt(0).toUpperCase() + verificationResult.certificate.status.slice(1)} 
                            color={
                              verificationResult.certificate.status === 'active' ? 'success' : 
                              verificationResult.certificate.status === 'expired' ? 'warning' : 
                              'error'
                            }
                          />
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default VerifyCertificate;
