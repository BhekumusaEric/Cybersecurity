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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Skeleton,
  Pagination,
  Stack,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Code as CodeIcon,
  Timer as TimerIcon,
  FilterList as FilterListIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Computer as ComputerIcon
} from '@mui/icons-material';
import axios from 'axios';

const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    status: '',
    environment: ''
  });
  const [page, setPage] = useState(1);
  const labsPerPage = 6;

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll simulate with setTimeout and mock data
        setTimeout(() => {
          // Mock labs data
          const mockLabs = [
            {
              id: '1',
              title: 'Network Scanning with Nmap',
              description: 'Learn how to perform comprehensive network scanning using Nmap, one of the most powerful reconnaissance tools.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Network+Scanning',
              difficulty: 'beginner',
              estimatedTime: 60,
              environmentType: 'browser',
              tools: ['Nmap', 'Wireshark'],
              moduleId: '4',
              moduleName: 'Reconnaissance',
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'completed',
              progress: 100,
              grade: 92
            },
            {
              id: '2',
              title: 'Vulnerability Scanning with OpenVAS',
              description: 'Practice using OpenVAS to identify vulnerabilities in target systems and generate comprehensive reports.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Vulnerability+Scanning',
              difficulty: 'intermediate',
              estimatedTime: 90,
              environmentType: 'browser',
              tools: ['OpenVAS', 'Nmap'],
              moduleId: '6',
              moduleName: 'Vulnerability Scanning',
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'in_progress',
              progress: 45
            },
            {
              id: '3',
              title: 'Web Application Penetration Testing',
              description: 'Learn to identify and exploit common web vulnerabilities using industry-standard tools.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Web+App+Testing',
              difficulty: 'intermediate',
              estimatedTime: 120,
              environmentType: 'browser',
              tools: ['Burp Suite', 'OWASP ZAP', 'SQLmap'],
              moduleId: '8',
              moduleName: 'Web Application Security',
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'not_started',
              progress: 0
            },
            {
              id: '4',
              title: 'Metasploit Framework Basics',
              description: 'Master the fundamentals of the Metasploit Framework for vulnerability exploitation.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Metasploit',
              difficulty: 'intermediate',
              estimatedTime: 90,
              environmentType: 'browser',
              tools: ['Metasploit', 'Nmap'],
              moduleId: '7',
              moduleName: 'Exploitation Basics',
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'not_started',
              progress: 0
            },
            {
              id: '5',
              title: 'Wireless Network Hacking',
              description: 'Learn techniques for testing the security of wireless networks using specialized tools.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Wireless+Hacking',
              difficulty: 'advanced',
              estimatedTime: 120,
              environmentType: 'local',
              tools: ['Aircrack-ng', 'Wireshark', 'Kismet'],
              moduleId: '9',
              moduleName: 'Wireless Security',
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'not_started',
              progress: 0
            },
            {
              id: '6',
              title: 'Password Cracking Techniques',
              description: 'Explore various password cracking methods and tools used in security assessments.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Password+Cracking',
              difficulty: 'intermediate',
              estimatedTime: 60,
              environmentType: 'browser',
              tools: ['John the Ripper', 'Hashcat', 'Hydra'],
              moduleId: '10',
              moduleName: 'Password Security',
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'not_started',
              progress: 0
            },
            {
              id: '7',
              title: 'Advanced Exploitation with Buffer Overflows',
              description: 'Learn the fundamentals of buffer overflow vulnerabilities and exploitation techniques.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Buffer+Overflow',
              difficulty: 'advanced',
              estimatedTime: 180,
              environmentType: 'local',
              tools: ['GDB', 'PEDA', 'Python'],
              moduleId: '11',
              moduleName: 'Advanced Exploitation',
              courseId: '2',
              courseName: 'Advanced Penetration Testing',
              status: 'not_started',
              progress: 0
            },
            {
              id: '8',
              title: 'Social Engineering Toolkit',
              description: 'Practice using the Social Engineering Toolkit (SET) for various social engineering attacks.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Social+Engineering',
              difficulty: 'beginner',
              estimatedTime: 60,
              environmentType: 'browser',
              tools: ['SET', 'Metasploit'],
              moduleId: '12',
              moduleName: 'Social Engineering',
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'not_started',
              progress: 0
            }
          ];
          
          setLabs(mockLabs);
          setFilteredLabs(mockLabs);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching labs:', err);
        setError('Failed to load labs. Please try again.');
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...labs];
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(lab => 
        lab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.tools.some(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply difficulty filter
    if (filters.difficulty) {
      result = result.filter(lab => lab.difficulty === filters.difficulty);
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(lab => lab.status === filters.status);
    }
    
    // Apply environment filter
    if (filters.environment) {
      result = result.filter(lab => lab.environmentType === filters.environment);
    }
    
    setFilteredLabs(result);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, filters, labs]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      difficulty: '',
      status: '',
      environment: ''
    });
  };
  
  // Pagination
  const indexOfLastLab = page * labsPerPage;
  const indexOfFirstLab = indexOfLastLab - labsPerPage;
  const currentLabs = filteredLabs.slice(indexOfFirstLab, indexOfLastLab);
  const pageCount = Math.ceil(filteredLabs.length / labsPerPage);

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Labs
        </Typography>
        <Skeleton variant="rectangular" height={48} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={20} sx={{ mt: 1 }} />
                  <Skeleton variant="text" height={20} />
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
        Hands-on Labs
      </Typography>
      
      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Labs"
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
          
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Difficulty</InputLabel>
              <Select
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                label="Difficulty"
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="not_started">Not Started</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Environment</InputLabel>
              <Select
                name="environment"
                value={filters.environment}
                onChange={handleFilterChange}
                label="Environment"
              >
                <MenuItem value="">All Environments</MenuItem>
                <MenuItem value="browser">Browser-based</MenuItem>
                <MenuItem value="local">Local VM</MenuItem>
                <MenuItem value="cloud">Cloud-based</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
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
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Showing {filteredLabs.length} {filteredLabs.length === 1 ? 'lab' : 'labs'}
          {(searchTerm || filters.difficulty || filters.status || filters.environment) && ' matching your filters'}
        </Typography>
      </Box>
      
      {/* Labs grid */}
      {filteredLabs.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No labs match your search criteria. Try adjusting your filters.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentLabs.map((lab) => (
              <Grid item xs={12} sm={6} md={4} key={lab.id}>
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
                    image={lab.thumbnail}
                    alt={lab.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {lab.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {lab.courseName}
                      {lab.moduleName && ` • ${lab.moduleName}`}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      <Chip 
                        size="small" 
                        label={lab.difficulty.charAt(0).toUpperCase() + lab.difficulty.slice(1)} 
                        color={
                          lab.difficulty === 'beginner' ? 'success' : 
                          lab.difficulty === 'intermediate' ? 'primary' : 
                          'error'
                        }
                      />
                      <Chip 
                        size="small" 
                        icon={<TimerIcon />} 
                        label={`${lab.estimatedTime} min`} 
                        variant="outlined" 
                      />
                      <Chip 
                        size="small" 
                        icon={<ComputerIcon />} 
                        label={lab.environmentType.charAt(0).toUpperCase() + lab.environmentType.slice(1)} 
                        variant="outlined" 
                      />
                    </Box>
                    
                    <Typography variant="body2" paragraph>
                      {lab.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto' }}>
                      {lab.tools.map((tool) => (
                        <Chip 
                          key={tool} 
                          label={tool} 
                          size="small" 
                          variant="outlined" 
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                    
                    {lab.progress > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            {lab.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={lab.progress} 
                          sx={{ height: 6, borderRadius: 3 }} 
                        />
                      </Box>
                    )}
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions>
                    <Button 
                      component={Link} 
                      to={`/labs/${lab.id}`}
                      endIcon={<ArrowForwardIcon />}
                      fullWidth
                    >
                      {lab.status === 'completed' ? 'View Lab' : 
                       lab.status === 'in_progress' ? 'Continue Lab' : 
                       'Start Lab'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Stack spacing={2}>
                <Pagination 
                  count={pageCount} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  showFirstButton 
                  showLastButton
                />
              </Stack>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Labs;
