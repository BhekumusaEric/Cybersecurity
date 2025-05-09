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
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  FilterList as FilterListIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import axios from 'axios';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    level: '',
    duration: '',
    tag: ''
  });
  const [page, setPage] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        // In a real app, this would be an API call
        // For now, we'll simulate with setTimeout and mock data
        setTimeout(() => {
          // Mock courses data
          const mockCourses = [
            {
              id: '1',
              title: 'Introduction to Ethical Hacking',
              description: 'Learn the fundamentals of ethical hacking, including methodology, legal considerations, and basic techniques.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Ethical+Hacking+Intro',
              duration: 4,
              level: 'beginner',
              tags: ['Fundamentals', 'Ethics', 'Methodology'],
              enrolledStudents: 1245,
              rating: 4.7,
              progress: 0
            },
            {
              id: '2',
              title: 'Network Security and Scanning',
              description: 'Master network scanning techniques, vulnerability assessment, and exploitation of network services.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Network+Security',
              duration: 6,
              level: 'intermediate',
              tags: ['Network', 'Scanning', 'Nmap'],
              enrolledStudents: 987,
              rating: 4.8,
              progress: 42
            },
            {
              id: '3',
              title: 'Web Application Security',
              description: 'Learn to identify and exploit common web vulnerabilities including XSS, SQL injection, and CSRF.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Web+App+Security',
              duration: 8,
              level: 'intermediate',
              tags: ['Web', 'OWASP', 'Injection'],
              enrolledStudents: 1532,
              rating: 4.9,
              progress: 0
            },
            {
              id: '4',
              title: 'Wireless Network Hacking',
              description: 'Understand wireless security protocols and learn techniques to test WiFi network security.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Wireless+Hacking',
              duration: 5,
              level: 'intermediate',
              tags: ['Wireless', 'WiFi', 'Aircrack'],
              enrolledStudents: 756,
              rating: 4.6,
              progress: 0
            },
            {
              id: '5',
              title: 'Advanced Exploitation Techniques',
              description: 'Master advanced exploitation methods including buffer overflows, shellcode development, and post-exploitation.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Advanced+Exploitation',
              duration: 10,
              level: 'advanced',
              tags: ['Exploitation', 'Shellcode', 'Buffer Overflow'],
              enrolledStudents: 432,
              rating: 4.9,
              progress: 0
            },
            {
              id: '6',
              title: 'Mobile Application Security',
              description: 'Learn to test and exploit vulnerabilities in Android and iOS applications.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Mobile+Security',
              duration: 7,
              level: 'intermediate',
              tags: ['Mobile', 'Android', 'iOS'],
              enrolledStudents: 678,
              rating: 4.7,
              progress: 0
            },
            {
              id: '7',
              title: 'Social Engineering Fundamentals',
              description: 'Understand the psychological principles behind social engineering and learn common attack techniques.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Social+Engineering',
              duration: 3,
              level: 'beginner',
              tags: ['Social Engineering', 'Psychology', 'Phishing'],
              enrolledStudents: 1876,
              rating: 4.8,
              progress: 0
            },
            {
              id: '8',
              title: 'Malware Analysis and Reverse Engineering',
              description: 'Learn techniques to analyze malicious software and understand its behavior.',
              thumbnail: 'https://via.placeholder.com/800x400?text=Malware+Analysis',
              duration: 9,
              level: 'advanced',
              tags: ['Malware', 'Reverse Engineering', 'Analysis'],
              enrolledStudents: 543,
              rating: 4.9,
              progress: 0
            }
          ];

          setCourses(mockCourses);
          setFilteredCourses(mockCourses);
          setLoading(false);
        }, 1000);

      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...courses];

    // Apply search term
    if (searchTerm) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply level filter
    if (filters.level) {
      result = result.filter(course => course.level === filters.level);
    }

    // Apply duration filter
    if (filters.duration) {
      switch (filters.duration) {
        case 'short':
          result = result.filter(course => course.duration <= 4);
          break;
        case 'medium':
          result = result.filter(course => course.duration > 4 && course.duration <= 8);
          break;
        case 'long':
          result = result.filter(course => course.duration > 8);
          break;
        default:
          break;
      }
    }

    // Apply tag filter
    if (filters.tag) {
      result = result.filter(course =>
        course.tags.some(tag => tag.toLowerCase() === filters.tag.toLowerCase())
      );
    }

    setFilteredCourses(result);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, filters, courses]);

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
      level: '',
      duration: '',
      tag: ''
    });
  };

  // Get all unique tags from courses
  const allTags = [...new Set(courses.flatMap(course => course.tags))];

  // Pagination
  const indexOfLastCourse = page * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const pageCount = Math.ceil(filteredCourses.length / coursesPerPage);

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Courses
        </Typography>
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
        Courses
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Courses"
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
              <InputLabel>Level</InputLabel>
              <Select
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
                label="Level"
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
              <InputLabel>Duration</InputLabel>
              <Select
                name="duration"
                value={filters.duration}
                onChange={handleFilterChange}
                label="Duration"
              >
                <MenuItem value="">Any Duration</MenuItem>
                <MenuItem value="short">Short (≤ 4 weeks)</MenuItem>
                <MenuItem value="medium">Medium (5-8 weeks)</MenuItem>
                <MenuItem value="long">Long (8+ weeks)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Topic</InputLabel>
              <Select
                name="tag"
                value={filters.tag}
                onChange={handleFilterChange}
                label="Topic"
              >
                <MenuItem value="">All Topics</MenuItem>
                {allTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                ))}
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
          Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
          {(searchTerm || filters.level || filters.duration || filters.tag) && ' matching your filters'}
        </Typography>
      </Box>

      {/* Course grid */}
      {filteredCourses.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No courses match your search criteria. Try adjusting your filters.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
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
                    image={course.thumbnail}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {course.title}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      <Chip
                        size="small"
                        label={course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        color={
                          course.level === 'beginner' ? 'success' :
                          course.level === 'intermediate' ? 'primary' :
                          'error'
                        }
                      />
                      <Chip
                        size="small"
                        icon={<TimerIcon />}
                        label={`${course.duration} weeks`}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        icon={<SchoolIcon />}
                        label={`${course.enrolledStudents} students`}
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {course.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto' }}>
                      {course.tags.slice(0, 3).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </CardContent>

                  <Divider />

                  <CardActions>
                    <Button
                      component={Link}
                      to={`/courses/${course.id}`}
                      endIcon={<ArrowForwardIcon />}
                      fullWidth
                    >
                      {course.progress > 0 ? 'Continue Course' : 'View Course'}
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

export default CourseList;
