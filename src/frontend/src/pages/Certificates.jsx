import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Divider,
  Alert,
  Skeleton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Verified as VerifiedIcon,
  EmojiEvents as EmojiEventsIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, this would be an API call
        // For now, we'll simulate with setTimeout and mock data
        setTimeout(() => {
          // Mock certificates data
          const mockCertificates = [
            {
              id: '1',
              certificateNumber: 'CERT-12345678',
              issueDate: '2023-05-15T10:30:00Z',
              status: 'active',
              fileUrl: 'https://via.placeholder.com/800x600?text=Certificate',
              verificationUrl: '/verify/CERT-12345678',
              Course: {
                id: '1',
                title: 'Ethical Hacking Fundamentals',
                level: 'beginner',
                thumbnail: 'https://via.placeholder.com/800x400?text=Ethical+Hacking+Fundamentals'
              }
            },
            {
              id: '2',
              certificateNumber: 'CERT-87654321',
              issueDate: '2023-06-20T14:45:00Z',
              status: 'active',
              fileUrl: 'https://via.placeholder.com/800x600?text=Certificate',
              verificationUrl: '/verify/CERT-87654321',
              Course: {
                id: '2',
                title: 'Advanced Penetration Testing',
                level: 'advanced',
                thumbnail: 'https://via.placeholder.com/800x400?text=Advanced+Penetration+Testing'
              }
            },
            {
              id: '3',
              certificateNumber: 'CERT-ABCDEF12',
              issueDate: '2023-04-10T09:15:00Z',
              status: 'expired',
              expiryDate: '2023-07-10T09:15:00Z',
              fileUrl: 'https://via.placeholder.com/800x600?text=Certificate',
              verificationUrl: '/verify/CERT-ABCDEF12',
              Course: {
                id: '3',
                title: 'Web Application Security',
                level: 'intermediate',
                thumbnail: 'https://via.placeholder.com/800x400?text=Web+Application+Security'
              }
            }
          ];
          
          setCertificates(mockCertificates);
          setFilteredCertificates(mockCertificates);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching certificates:', err);
        setError('Failed to load certificates. Please try again.');
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...certificates];
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(cert => 
        cert.Course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(cert => cert.status === statusFilter);
    }
    
    setFilteredCertificates(result);
  }, [searchTerm, statusFilter, certificates]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const handleDownload = (certificate) => {
    // In a real app, this would download the certificate
    window.open(certificate.fileUrl, '_blank');
  };

  const handleShare = (certificate) => {
    // In a real app, this would open a share dialog
    const shareUrl = `${window.location.origin}/verify/${certificate.certificateNumber}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Certificate: ${certificate.Course.title}`,
        text: 'Check out my certificate!',
        url: shareUrl
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(shareUrl);
      alert('Certificate verification link copied to clipboard!');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Certificates
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={20} sx={{ mt: 1 }} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Certificates
      </Typography>
      
      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Certificates"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="revoked">Revoked</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4} md={3}>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={clearFilters}
              startIcon={<FilterListIcon />}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Results summary */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Showing {filteredCertificates.length} {filteredCertificates.length === 1 ? 'certificate' : 'certificates'}
          {(searchTerm || statusFilter) && ' matching your filters'}
        </Typography>
      </Box>
      
      {/* Certificates grid */}
      {filteredCertificates.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No certificates match your search criteria. Try adjusting your filters.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredCertificates.map((certificate) => (
            <Grid item xs={12} sm={6} md={4} key={certificate.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={certificate.Course.thumbnail}
                  alt={certificate.Course.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h5" component="h2">
                      {certificate.Course.title}
                    </Typography>
                    <Chip 
                      label={certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)} 
                      color={
                        certificate.status === 'active' ? 'success' : 
                        certificate.status === 'expired' ? 'warning' : 
                        'error'
                      }
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Certificate ID: {certificate.certificateNumber}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Issued on: {formatDate(certificate.issueDate)}
                  </Typography>
                  
                  {certificate.expiryDate && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Expires on: {formatDate(certificate.expiryDate)}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', mt: 2 }}>
                    <Chip 
                      icon={<EmojiEventsIcon />} 
                      label={certificate.Course.level.charAt(0).toUpperCase() + certificate.Course.level.slice(1)} 
                      variant="outlined" 
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      icon={<VerifiedIcon />} 
                      label="Verified" 
                      variant="outlined" 
                      size="small"
                      color="success"
                    />
                  </Box>
                </CardContent>
                
                <Divider />
                
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(certificate)}
                    size="small"
                  >
                    Download
                  </Button>
                  
                  <Button
                    startIcon={<ShareIcon />}
                    onClick={() => handleShare(certificate)}
                    size="small"
                  >
                    Share
                  </Button>
                  
                  <Button
                    component={Link}
                    to={`/certificates/${certificate.id}`}
                    size="small"
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Certificates;
