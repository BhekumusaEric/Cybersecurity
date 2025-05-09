import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
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
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';

// Custom tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`assessment-tabpanel-${index}`}
      aria-labelledby={`assessment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll simulate with setTimeout and mock data
        setTimeout(() => {
          // Mock assessments data
          const mockAssessments = [
            {
              id: '1',
              title: 'Introduction to Ethical Hacking Quiz',
              description: 'Test your knowledge of ethical hacking fundamentals, terminology, and methodology.',
              type: 'quiz',
              timeLimit: 20,
              passingScore: 70,
              dueDate: '2023-06-15T23:59:59Z',
              moduleId: '1',
              moduleName: 'Introduction to Ethical Hacking',
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'completed',
              score: 85,
              passed: true,
              questionsCount: 10
            },
            {
              id: '2',
              title: 'Network Security Fundamentals Quiz',
              description: 'Test your knowledge of network security concepts, protocols, and common vulnerabilities.',
              type: 'quiz',
              timeLimit: 30,
              passingScore: 70,
              dueDate: '2023-06-30T23:59:59Z',
              moduleId: '2',
              moduleName: 'Network Security',
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'not_started',
              questionsCount: 15
            },
            {
              id: '3',
              title: 'Web Application Security Assessment',
              description: 'Demonstrate your understanding of web application vulnerabilities and security testing techniques.',
              type: 'assignment',
              timeLimit: null,
              passingScore: 70,
              dueDate: '2023-07-15T23:59:59Z',
              moduleId: '3',
              moduleName: 'Web Application Security',
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'in_progress',
              questionsCount: 5
            },
            {
              id: '4',
              title: 'Midterm Exam: Ethical Hacking Fundamentals',
              description: 'Comprehensive assessment covering ethical hacking principles, network security, and web application security.',
              type: 'exam',
              timeLimit: 120,
              passingScore: 75,
              dueDate: '2023-07-30T23:59:59Z',
              moduleId: null,
              moduleName: null,
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'not_started',
              questionsCount: 50
            },
            {
              id: '5',
              title: 'Social Engineering Techniques Quiz',
              description: 'Test your knowledge of social engineering attack vectors, techniques, and defenses.',
              type: 'quiz',
              timeLimit: 25,
              passingScore: 70,
              dueDate: '2023-08-15T23:59:59Z',
              moduleId: '7',
              moduleName: 'Social Engineering',
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'not_started',
              questionsCount: 12
            },
            {
              id: '6',
              title: 'Wireless Security Lab Report',
              description: 'Submit a detailed report on wireless network security testing and findings.',
              type: 'assignment',
              timeLimit: null,
              passingScore: 70,
              dueDate: '2023-08-30T23:59:59Z',
              moduleId: '4',
              moduleName: 'Wireless Security',
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'not_started',
              questionsCount: 1
            },
            {
              id: '7',
              title: 'Final Exam: Ethical Hacking Certification',
              description: 'Comprehensive final assessment covering all aspects of ethical hacking.',
              type: 'exam',
              timeLimit: 180,
              passingScore: 80,
              dueDate: '2023-09-30T23:59:59Z',
              moduleId: null,
              moduleName: null,
              courseId: '1',
              courseName: 'Ethical Hacking Fundamentals',
              status: 'not_started',
              questionsCount: 75
            }
          ];
          
          setAssessments(mockAssessments);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError('Failed to load assessments. Please try again.');
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  // Filter assessments based on tab, search term, and type filter
  const getFilteredAssessments = () => {
    return assessments.filter(assessment => {
      // Filter by tab (status)
      if (tabValue === 1 && assessment.status !== 'not_started') return false;
      if (tabValue === 2 && assessment.status !== 'in_progress') return false;
      if (tabValue === 3 && assessment.status !== 'completed') return false;
      
      // Filter by search term
      if (searchTerm && !assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !assessment.courseName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by type
      if (typeFilter && assessment.type !== typeFilter) return false;
      
      return true;
    });
  };

  const filteredAssessments = getFilteredAssessments();

  // Group assessments by due date
  const groupAssessmentsByDueDate = () => {
    const groups = {
      overdue: [],
      thisWeek: [],
      upcoming: []
    };
    
    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);
    
    filteredAssessments.forEach(assessment => {
      if (!assessment.dueDate) {
        groups.upcoming.push(assessment);
        return;
      }
      
      const dueDate = new Date(assessment.dueDate);
      
      if (dueDate < now && assessment.status !== 'completed') {
        groups.overdue.push(assessment);
      } else if (dueDate <= oneWeekFromNow) {
        groups.thisWeek.push(assessment);
      } else {
        groups.upcoming.push(assessment);
      }
    });
    
    return groups;
  };

  const assessmentGroups = groupAssessmentsByDueDate();

  // Get icon based on assessment type
  const getAssessmentIcon = (type) => {
    switch (type) {
      case 'quiz':
        return <QuizIcon color="primary" />;
      case 'assignment':
        return <DescriptionIcon color="secondary" />;
      case 'exam':
        return <AssignmentIcon color="error" />;
      default:
        return <AssignmentIcon />;
    }
  };

  // Format due date
  const formatDueDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if assessment is overdue
  const isOverdue = (dateString, status) => {
    if (!dateString || status === 'completed') return false;
    
    const dueDate = new Date(dateString);
    const now = new Date();
    
    return dueDate < now;
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Assessments
        </Typography>
        <Skeleton variant="rectangular" height={48} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" height={200} />
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
        Assessments
      </Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search Assessments"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={handleTypeFilterChange}
            label="Type"
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="quiz">Quizzes</MenuItem>
            <MenuItem value="assignment">Assignments</MenuItem>
            <MenuItem value="exam">Exams</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="assessment tabs">
          <Tab label="All" />
          <Tab label="Not Started" />
          <Tab label="In Progress" />
          <Tab label="Completed" />
        </Tabs>
      </Box>
      
      {/* Tab panels */}
      <TabPanel value={tabValue} index={0}>
        {filteredAssessments.length === 0 ? (
          <Alert severity="info">
            No assessments match your search criteria.
          </Alert>
        ) : (
          <>
            {/* Overdue assessments */}
            {assessmentGroups.overdue.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="error" gutterBottom>
                  <WarningIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Overdue
                </Typography>
                <Grid container spacing={3}>
                  {assessmentGroups.overdue.map((assessment) => (
                    <Grid item xs={12} sm={6} md={4} key={assessment.id}>
                      <AssessmentCard assessment={assessment} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* This week assessments */}
            {assessmentGroups.thisWeek.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  <ScheduleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Due This Week
                </Typography>
                <Grid container spacing={3}>
                  {assessmentGroups.thisWeek.map((assessment) => (
                    <Grid item xs={12} sm={6} md={4} key={assessment.id}>
                      <AssessmentCard assessment={assessment} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Upcoming assessments */}
            {assessmentGroups.upcoming.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Upcoming
                </Typography>
                <Grid container spacing={3}>
                  {assessmentGroups.upcoming.map((assessment) => (
                    <Grid item xs={12} sm={6} md={4} key={assessment.id}>
                      <AssessmentCard assessment={assessment} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {filteredAssessments.length === 0 ? (
          <Alert severity="info">
            No assessments match your search criteria.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredAssessments.map((assessment) => (
              <Grid item xs={12} sm={6} md={4} key={assessment.id}>
                <AssessmentCard assessment={assessment} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {filteredAssessments.length === 0 ? (
          <Alert severity="info">
            No assessments match your search criteria.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredAssessments.map((assessment) => (
              <Grid item xs={12} sm={6} md={4} key={assessment.id}>
                <AssessmentCard assessment={assessment} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        {filteredAssessments.length === 0 ? (
          <Alert severity="info">
            No assessments match your search criteria.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredAssessments.map((assessment) => (
              <Grid item xs={12} sm={6} md={4} key={assessment.id}>
                <AssessmentCard assessment={assessment} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
    </Box>
  );
};

// Assessment card component
const AssessmentCard = ({ assessment }) => {
  const isAssessmentOverdue = isOverdue(assessment.dueDate, assessment.status);
  
  return (
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
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ mr: 1.5, mt: 0.5 }}>
            {getAssessmentIcon(assessment.type)}
          </Box>
          <Box>
            <Typography variant="h6" component="h2" gutterBottom>
              {assessment.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {assessment.courseName}
              {assessment.moduleName && ` • ${assessment.moduleName}`}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" paragraph>
          {assessment.description}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          <Chip 
            size="small" 
            label={assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)} 
            color={
              assessment.type === 'quiz' ? 'primary' : 
              assessment.type === 'assignment' ? 'secondary' : 
              'error'
            }
          />
          <Chip 
            size="small" 
            label={`${assessment.questionsCount} question${assessment.questionsCount !== 1 ? 's' : ''}`} 
            variant="outlined" 
          />
          {assessment.timeLimit && (
            <Chip 
              size="small" 
              icon={<ScheduleIcon />} 
              label={`${assessment.timeLimit} min`} 
              variant="outlined" 
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color={isAssessmentOverdue ? 'error.main' : 'text.secondary'}>
            {isAssessmentOverdue ? 'Overdue: ' : 'Due: '}
            {formatDueDate(assessment.dueDate)}
          </Typography>
          
          {assessment.status === 'completed' && (
            <Chip 
              size="small" 
              icon={<CheckCircleIcon />} 
              label={`${assessment.score}% - ${assessment.passed ? 'Passed' : 'Failed'}`} 
              color={assessment.passed ? 'success' : 'error'} 
              variant="outlined" 
            />
          )}
        </Box>
      </CardContent>
      
      <Divider />
      
      <CardActions>
        <Button 
          component={Link} 
          to={`/assessments/${assessment.id}`}
          endIcon={<ArrowForwardIcon />}
          fullWidth
        >
          {assessment.status === 'completed' ? 'View Results' : 
           assessment.status === 'in_progress' ? 'Continue' : 
           'Start Assessment'}
        </Button>
      </CardActions>
    </Card>
  );
};

// Helper function to format due date
const formatDueDate = (dateString) => {
  if (!dateString) return 'No due date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

// Helper function to check if assessment is overdue
const isOverdue = (dateString, status) => {
  if (!dateString || status === 'completed') return false;
  
  const dueDate = new Date(dateString);
  const now = new Date();
  
  return dueDate < now;
};

export default Assessments;
