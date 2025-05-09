import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Alert,
  Skeleton,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  Assignment as AssignmentIcon,
  Download as DownloadIcon,
  Link as LinkIcon,
  Flag as FlagIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

// Custom tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`module-tabpanel-${index}`}
      aria-labelledby={`module-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ModuleDetail = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [progress, setProgress] = useState(0);
  const [nextModule, setNextModule] = useState(null);
  const [prevModule, setPrevModule] = useState(null);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setLoading(true);
        
        // In a real app, these would be actual API calls
        // For now, we'll simulate with setTimeout and mock data
        setTimeout(() => {
          // Mock course data
          const mockCourse = {
            id: courseId,
            title: 'Ethical Hacking: Network Security',
          };
          
          // Mock module data
          const mockModule = {
            id: moduleId,
            title: 'Network Scanning',
            description: 'Learn how to perform comprehensive network scanning using industry-standard tools.',
            content: `
# Network Scanning

Network scanning is a crucial phase in the ethical hacking process. It involves systematically probing network hosts to identify available services, open ports, and potential vulnerabilities.

## Key Scanning Techniques

1. **Port Scanning**: Identifying open ports on target systems
2. **Service Detection**: Determining what services are running on open ports
3. **OS Fingerprinting**: Identifying the operating system of target hosts
4. **Version Detection**: Determining software versions for vulnerability assessment

## Common Tools

- **Nmap**: The most versatile and powerful network scanner
- **Masscan**: Extremely fast port scanner
- **Unicornscan**: Flexible and efficient scanner
- **Zenmap**: GUI version of Nmap for visual scanning

## Ethical Considerations

Always ensure you have proper authorization before scanning any network. Unauthorized scanning may be illegal and unethical.

## Best Practices

- Start with basic scans and gradually increase intensity
- Use timing options to avoid detection or overwhelming targets
- Document all findings systematically
- Correlate results from multiple scan types
            `,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 90,
            type: 'lecture',
            resources: [
              {
                title: 'Nmap Cheat Sheet',
                type: 'pdf',
                url: '#'
              },
              {
                title: 'Network Scanning Techniques',
                type: 'article',
                url: '#'
              },
              {
                title: 'Scanning Lab Guide',
                type: 'lab',
                url: '#'
              }
            ],
            steps: [
              {
                title: 'Introduction to Network Scanning',
                content: 'Overview of scanning techniques and methodology'
              },
              {
                title: 'Port Scanning with Nmap',
                content: 'Learn how to use Nmap for comprehensive port scanning'
              },
              {
                title: 'Service and Version Detection',
                content: 'Techniques for identifying services and software versions'
              },
              {
                title: 'OS Fingerprinting',
                content: 'Methods for determining target operating systems'
              },
              {
                title: 'Scan Analysis',
                content: 'How to interpret and document scanning results'
              }
            ],
            quiz: {
              questions: [
                {
                  question: 'What is the default Nmap scan type?',
                  options: [
                    'SYN scan',
                    'TCP connect scan',
                    'UDP scan',
                    'ICMP scan'
                  ],
                  correctAnswer: 1
                },
                {
                  question: 'Which Nmap option is used for OS detection?',
                  options: [
                    '-sV',
                    '-O',
                    '-A',
                    '-p'
                  ],
                  correctAnswer: 1
                }
              ]
            }
          };
          
          // Mock modules list for navigation
          const mockModules = [
            { id: '1', title: 'Introduction to Network Security', order: 1 },
            { id: '2', title: 'Network Reconnaissance', order: 2 },
            { id: '3', title: 'Network Scanning', order: 3 },
            { id: '4', title: 'Vulnerability Assessment', order: 4 },
            { id: '5', title: 'Network Exploitation', order: 5 },
            { id: '6', title: 'Network Security Quiz', order: 6 }
          ];
          
          // Find current module index
          const currentIndex = mockModules.findIndex(m => m.id === moduleId);
          
          // Set previous and next modules
          setPrevModule(currentIndex > 0 ? mockModules[currentIndex - 1] : null);
          setNextModule(currentIndex < mockModules.length - 1 ? mockModules[currentIndex + 1] : null);
          
          setCourse(mockCourse);
          setModule(mockModule);
          setProgress(60); // Mock progress percentage
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching module data:', err);
        setError('Failed to load module data. Please try again.');
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [courseId, moduleId]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    // In a real app, this would update the progress in the backend
    setProgress(100);
    
    // Navigate to next module if available
    if (nextModule) {
      navigate(`/courses/${courseId}/modules/${nextModule.id}`);
    } else {
      // Navigate to course completion page or back to course
      navigate(`/courses/${courseId}`);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
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

  if (!module || !course) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        Module not found.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Navigation header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Button
            component={Link}
            to={`/courses/${courseId}`}
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 1 }}
          >
            Back to Course
          </Button>
          <Typography variant="h4" component="h1">
            {module.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {course.title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {prevModule && (
            <Tooltip title={prevModule.title}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                component={Link}
                to={`/courses/${courseId}/modules/${prevModule.id}`}
              >
                Previous
              </Button>
            </Tooltip>
          )}
          
          {nextModule && (
            <Tooltip title={nextModule.title}>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                component={Link}
                to={`/courses/${courseId}/modules/${nextModule.id}`}
              >
                Next
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      {/* Progress indicator */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Module Progress
          </Typography>
          <Typography variant="body2" color="primary" fontWeight="bold">
            {progress}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 8, borderRadius: 4, mt: 1 }} 
        />
      </Paper>
      
      {/* Module content tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Content" icon={<DescriptionIcon />} iconPosition="start" />
          <Tab label="Video" icon={<PlayArrowIcon />} iconPosition="start" />
          <Tab label="Steps" icon={<FlagIcon />} iconPosition="start" />
          <Tab label="Resources" icon={<BookmarkIcon />} iconPosition="start" />
          {module.type === 'lab' && (
            <Tab label="Lab" icon={<CodeIcon />} iconPosition="start" />
          )}
          {module.quiz && (
            <Tab label="Quiz" icon={<AssignmentIcon />} iconPosition="start" />
          )}
        </Tabs>
        
        {/* Content tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ typography: 'body1' }}>
            <ReactMarkdown>
              {module.content}
            </ReactMarkdown>
          </Box>
        </TabPanel>
        
        {/* Video tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <iframe
              src={module.videoUrl}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={module.title}
            />
          </Box>
        </TabPanel>
        
        {/* Steps tab */}
        <TabPanel value={tabValue} index={2}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {module.steps.map((step, index) => (
              <Step key={step.title}>
                <StepLabel>{step.title}</StepLabel>
                <StepContent>
                  <Typography>{step.content}</Typography>
                  <Box sx={{ mb: 2, mt: 1 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={index === module.steps.length - 1 ? handleComplete : handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === module.steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </TabPanel>
        
        {/* Resources tab */}
        <TabPanel value={tabValue} index={3}>
          <List>
            {module.resources.map((resource, index) => (
              <ListItem key={index} divider={index < module.resources.length - 1}>
                <ListItemIcon>
                  {resource.type === 'pdf' && <DescriptionIcon color="error" />}
                  {resource.type === 'article' && <LinkIcon color="primary" />}
                  {resource.type === 'lab' && <CodeIcon color="secondary" />}
                </ListItemIcon>
                <ListItemText 
                  primary={resource.title} 
                  secondary={resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} 
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  component="a"
                  href={resource.url}
                  target="_blank"
                >
                  Download
                </Button>
              </ListItem>
            ))}
          </List>
        </TabPanel>
        
        {/* Lab tab */}
        {module.type === 'lab' && (
          <TabPanel value={tabValue} index={4}>
            <Alert severity="info" sx={{ mb: 3 }}>
              This lab requires you to use Kali Linux and the provided virtual machines. Make sure your lab environment is set up before proceeding.
            </Alert>
            
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CodeIcon />}
              component={Link}
              to={`/labs/${moduleId}`}
              sx={{ mb: 3 }}
            >
              Launch Lab Environment
            </Button>
            
            <Typography variant="h6" gutterBottom>
              Lab Instructions
            </Typography>
            
            <Box sx={{ typography: 'body1' }}>
              <ReactMarkdown>
                {`
# Network Scanning Lab

In this lab, you will learn how to use Nmap to scan networks and identify services.

## Objectives

1. Discover active hosts on the network
2. Identify open ports on target systems
3. Determine running services and versions
4. Perform OS fingerprinting

## Tasks

1. Open a terminal in Kali Linux
2. Run a ping sweep to discover hosts: \`nmap -sn 192.168.1.0/24\`
3. Perform a basic port scan: \`nmap 192.168.1.100\`
4. Perform service detection: \`nmap -sV 192.168.1.100\`
5. Perform OS detection: \`nmap -O 192.168.1.100\`
6. Document your findings
                `}
              </ReactMarkdown>
            </Box>
          </TabPanel>
        )}
        
        {/* Quiz tab */}
        {module.quiz && (
          <TabPanel value={tabValue} index={module.type === 'lab' ? 5 : 4}>
            <Typography variant="h6" gutterBottom>
              Module Quiz
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Complete this quiz to test your understanding of the module content.
            </Alert>
            
            {module.quiz.questions.map((question, qIndex) => (
              <Card key={qIndex} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {qIndex + 1}. {question.question}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {question.options.map((option, oIndex) => (
                      <Grid item xs={12} sm={6} key={oIndex}>
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{ 
                            justifyContent: 'flex-start', 
                            textAlign: 'left',
                            height: '100%'
                          }}
                        >
                          {option}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            ))}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
              >
                Submit Quiz
              </Button>
            </Box>
          </TabPanel>
        )}
      </Paper>
      
      {/* Module completion card */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Ready to complete this module?
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Mark this module as complete when you've finished all the content and exercises.
            {progress < 100 && " You've made progress, but haven't completed all steps yet."}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={handleComplete}
            disabled={progress < 100}
          >
            Mark as Complete
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ModuleDetail;
