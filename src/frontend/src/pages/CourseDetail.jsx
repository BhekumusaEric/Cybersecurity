import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Skeleton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  PlayArrow as PlayArrowIcon,
  Description as DescriptionIcon,
  Timer as TimerIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import axios from 'axios';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        // In a real app, these would be actual API calls
        // For now, we'll simulate with setTimeout and mock data
        setTimeout(() => {
          // Mock course data
          const mockCourse = {
            id: courseId,
            title: 'Ethical Hacking: Network Security',
            description: 'Learn how to identify and exploit vulnerabilities in network infrastructure. This comprehensive course covers reconnaissance, scanning, enumeration, exploitation, and reporting for network security assessments.',
            thumbnail: 'https://via.placeholder.com/800x400?text=Network+Security',
            duration: 12,
            level: 'intermediate',
            prerequisites: ['Basic networking knowledge', 'Linux fundamentals', 'Command line experience'],
            learningOutcomes: [
              'Understand network security principles',
              'Perform comprehensive network scanning',
              'Identify common network vulnerabilities',
              'Exploit network services securely',
              'Document findings professionally'
            ],
            tags: ['Network', 'Security', 'Scanning', 'Exploitation'],
            instructor: {
              name: 'John Smith',
              bio: 'Cybersecurity expert with 15 years of experience',
              avatar: 'https://via.placeholder.com/150'
            }
          };
          
          // Mock modules data
          const mockModules = [
            {
              id: '1',
              title: 'Introduction to Network Security',
              description: 'Overview of network security concepts and principles',
              order: 1,
              duration: 60,
              isCompleted: true,
              progress: 100,
              type: 'lecture'
            },
            {
              id: '2',
              title: 'Network Reconnaissance',
              description: 'Techniques for gathering information about target networks',
              order: 2,
              duration: 90,
              isCompleted: true,
              progress: 100,
              type: 'lecture'
            },
            {
              id: '3',
              title: 'Network Scanning Lab',
              description: 'Hands-on lab for scanning networks using Nmap and other tools',
              order: 3,
              duration: 120,
              isCompleted: false,
              progress: 60,
              type: 'lab'
            },
            {
              id: '4',
              title: 'Vulnerability Assessment',
              description: 'Identifying vulnerabilities in network services',
              order: 4,
              duration: 90,
              isCompleted: false,
              progress: 30,
              type: 'lecture'
            },
            {
              id: '5',
              title: 'Network Exploitation',
              description: 'Ethical exploitation of network vulnerabilities',
              order: 5,
              duration: 120,
              isCompleted: false,
              progress: 0,
              type: 'lecture',
              locked: true
            },
            {
              id: '6',
              title: 'Network Security Quiz',
              description: 'Test your knowledge of network security concepts',
              order: 6,
              duration: 45,
              isCompleted: false,
              progress: 0,
              type: 'assessment',
              locked: true
            }
          ];
          
          setCourse(mockCourse);
          setModules(mockModules);
          setProgress(42); // Mock progress percentage
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course data. Please try again.');
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={400} />
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

  if (!course) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        Course not found.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Course Header */}
      <Card sx={{ mb: 4, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="240"
          image={course.thumbnail}
          alt={course.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 auto', mr: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {course.title}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  icon={<TimerIcon />} 
                  label={`${course.duration} weeks`} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  icon={<SchoolIcon />} 
                  label={course.level.charAt(0).toUpperCase() + course.level.slice(1)} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
                {course.tags.map((tag) => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    size="small" 
                    color="default" 
                    variant="outlined" 
                  />
                ))}
              </Box>
              
              <Typography variant="body1" paragraph>
                {course.description}
              </Typography>
            </Box>
            
            <Box sx={{ minWidth: 200, textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                {progress}% Complete
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 10, borderRadius: 5, mb: 2 }} 
              />
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<PlayArrowIcon />}
                component={Link}
                to={`/courses/${courseId}/modules/${modules.find(m => m.progress < 100 && !m.locked)?.id || modules[0].id}`}
                fullWidth
                sx={{ mb: 1 }}
              >
                {progress > 0 ? 'Continue Learning' : 'Start Course'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Course Content */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="h2" gutterBottom>
            Course Content
          </Typography>
          
          <Paper sx={{ mb: 4 }}>
            <List disablePadding>
              {modules.map((module, index) => (
                <Box key={module.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    button
                    component={Link}
                    to={`/courses/${courseId}/modules/${module.id}`}
                    disabled={module.locked}
                    sx={{
                      py: 2,
                      px: 3,
                      '&.Mui-disabled': {
                        opacity: 0.7,
                      }
                    }}
                  >
                    <ListItemIcon>
                      {module.type === 'lecture' && <DescriptionIcon color={module.isCompleted ? 'success' : 'primary'} />}
                      {module.type === 'lab' && <CodeIcon color={module.isCompleted ? 'success' : 'primary'} />}
                      {module.type === 'assessment' && <AssignmentIcon color={module.isCompleted ? 'success' : 'primary'} />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1" component="span">
                            {module.order}. {module.title}
                          </Typography>
                          {module.locked && (
                            <LockIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {module.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Chip 
                              size="small" 
                              label={`${module.duration} min`} 
                              variant="outlined" 
                              sx={{ mr: 1 }} 
                            />
                            <Chip 
                              size="small" 
                              label={module.type.charAt(0).toUpperCase() + module.type.slice(1)} 
                              color={
                                module.type === 'lecture' ? 'primary' : 
                                module.type === 'lab' ? 'secondary' : 
                                'warning'
                              }
                              variant="outlined" 
                              sx={{ mr: 1 }} 
                            />
                            {module.isCompleted ? (
                              <Chip 
                                size="small" 
                                icon={<CheckCircleIcon />} 
                                label="Completed" 
                                color="success" 
                                variant="outlined" 
                              />
                            ) : module.progress > 0 ? (
                              <Chip 
                                size="small" 
                                label={`${module.progress}% Complete`} 
                                color="info" 
                                variant="outlined" 
                              />
                            ) : null}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            {/* Instructor Info */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Instructor
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="img"
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  sx={{ width: 60, height: 60, borderRadius: '50%', mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {course.instructor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.instructor.bio}
                  </Typography>
                </Box>
              </Box>
            </Paper>
            
            {/* Prerequisites */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Prerequisites
              </Typography>
              <List dense>
                {course.prerequisites.map((prerequisite, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <FlagIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={prerequisite} />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            {/* Learning Outcomes */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Learning Outcomes
              </Typography>
              <List dense>
                {course.learningOutcomes.map((outcome, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={outcome} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseDetail;
