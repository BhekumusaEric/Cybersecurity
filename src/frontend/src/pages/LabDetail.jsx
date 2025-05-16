import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  AlertTitle,
  Skeleton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Terminal as TerminalIcon,
  Computer as ComputerIcon,
  Upload as UploadIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import MobileLabInterface from '../components/labs/MobileLabInterface';

// Custom tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lab-tabpanel-${index}`}
      aria-labelledby={`lab-tab-${index}`}
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

const LabDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { labId } = useParams();
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [labStatus, setLabStatus] = useState('stopped'); // 'stopped', 'starting', 'running', 'error'
  const [terminalOutput, setTerminalOutput] = useState('');
  const [command, setCommand] = useState('');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submission, setSubmission] = useState({
    content: '',
    screenshots: []
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        setLoading(true);

        // In a real app, these would be actual API calls
        // For now, we'll simulate with setTimeout and mock data
        setTimeout(() => {
          // Mock lab data
          const mockLab = {
            id: labId,
            title: 'Network Scanning with Nmap',
            description: 'Learn how to perform comprehensive network scanning using Nmap.',
            instructions: `
# Network Scanning Lab

In this lab, you will learn how to use Nmap to scan networks and identify services.

## Objectives

1. Discover active hosts on the network
2. Identify open ports on target systems
3. Determine running services and versions
4. Perform OS fingerprinting

## Environment Setup

This lab includes:
- Kali Linux as your attack machine (IP: 192.168.1.10)
- Metasploitable 2 as your primary target (IP: 192.168.1.100)
- Additional virtual machines in the target network

## Safety and Ethics Notice

Remember that scanning networks without permission is illegal and unethical. In this lab, you are only authorized to scan the provided virtual machines in the lab environment.
            `,
            difficulty: 'medium',
            estimatedTime: 60,
            environmentType: 'browser',
            tools: ['Nmap', 'Wireshark', 'Metasploit'],
            steps: [
              {
                title: 'Network Discovery',
                content: `
### Task: Discover active hosts on the network

1. Open a terminal in your Kali Linux VM
2. Identify your own IP address using:
   \`\`\`
   ip addr show
   \`\`\`
3. Perform a ping sweep to discover active hosts:
   \`\`\`
   sudo nmap -sn 192.168.1.0/24
   \`\`\`
4. Record all active IP addresses found in the target network
                `
              },
              {
                title: 'Basic Port Scanning',
                content: `
### Task: Identify open ports on the target

1. Perform a basic TCP scan on the Metasploitable machine:
   \`\`\`
   sudo nmap 192.168.1.100
   \`\`\`
2. Analyze the results and identify open ports
3. Perform a more comprehensive scan:
   \`\`\`
   sudo nmap -p 1-65535 192.168.1.100
   \`\`\`
4. Compare the results with the default scan
                `
              },
              {
                title: 'Service and Version Detection',
                content: `
### Task: Identify running services and versions

1. Perform a service version detection scan:
   \`\`\`
   sudo nmap -sV 192.168.1.100
   \`\`\`
2. Identify the services running on each open port
3. Note any outdated or potentially vulnerable services
4. Perform a more aggressive version scan:
   \`\`\`
   sudo nmap -sV --version-intensity 9 192.168.1.100
   \`\`\`
                `
              },
              {
                title: 'OS Fingerprinting',
                content: `
### Task: Determine the operating system of the target

1. Perform OS detection:
   \`\`\`
   sudo nmap -O 192.168.1.100
   \`\`\`
2. Record the operating system details detected
3. Run a more comprehensive scan combining OS and service detection:
   \`\`\`
   sudo nmap -A 192.168.1.100
   \`\`\`
                `
              },
              {
                title: 'Documentation',
                content: `
### Task: Document your findings

1. Save scan results in all formats:
   \`\`\`
   sudo nmap -A 192.168.1.100 -oA scan_results
   \`\`\`
2. Examine the different output files:
   - scan_results.nmap (normal output)
   - scan_results.xml (XML format)
   - scan_results.gnmap (grepable format)
3. Prepare your submission with:
   - Screenshots of key findings
   - Summary of discovered services
   - List of potential vulnerabilities
   - Recommendations for securing the system
                `
              }
            ],
            resources: [
              {
                title: 'Nmap Cheat Sheet',
                type: 'pdf',
                url: '#'
              },
              {
                title: 'Metasploitable 2 Guide',
                type: 'pdf',
                url: '#'
              },
              {
                title: 'Network Scanning Techniques',
                type: 'article',
                url: '#'
              }
            ],
            submissionType: 'text',
            submissionInstructions: 'Submit a detailed report including screenshots of your scan results, a list of discovered services, potential vulnerabilities, and security recommendations.'
          };

          setLab(mockLab);
          setProgress(30); // Mock progress percentage
          setLoading(false);
        }, 1000);

      } catch (err) {
        console.error('Error fetching lab data:', err);
        setError('Failed to load lab data. Please try again.');
        setLoading(false);
      }
    };

    fetchLabData();
  }, [labId]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // Update progress based on steps completed
    setProgress(Math.min(100, ((activeStep + 1) / lab.steps.length) * 100));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCommandChange = (e) => {
    setCommand(e.target.value);
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    // In a real app, this would send the command to the lab environment
    // For now, we'll simulate with mock output
    const newOutput = `${terminalOutput}
kali@kali:~$ ${command}
${getMockCommandOutput(command)}
`;

    setTerminalOutput(newOutput);
    setCommand('');
  };

  const handleStartLab = () => {
    setLabStatus('starting');

    // Simulate lab startup
    setTimeout(() => {
      setLabStatus('running');
      setTerminalOutput('Starting Kali Linux...\nKali Linux 2023.1 started successfully.\n\nkali@kali:~$ ');
    }, 3000);
  };

  const handleStopLab = () => {
    setLabStatus('stopped');
    setTerminalOutput('');
  };

  const handleResetLab = () => {
    setLabStatus('starting');

    // Simulate lab reset
    setTimeout(() => {
      setLabStatus('running');
      setTerminalOutput('Resetting lab environment...\nKali Linux 2023.1 restarted successfully.\n\nkali@kali:~$ ');
    }, 2000);
  };

  const handleOpenSubmitDialog = () => {
    setSubmitDialogOpen(true);
  };

  const handleCloseSubmitDialog = () => {
    setSubmitDialogOpen(false);
  };

  const handleSubmissionChange = (e) => {
    setSubmission({
      ...submission,
      content: e.target.value
    });
  };

  const handleSubmitLab = () => {
    // In a real app, this would submit the lab to the backend
    // For now, we'll just close the dialog and show a success message
    setSubmitDialogOpen(false);
    setProgress(100);
    alert('Lab submission successful!');
  };

  // Helper function to generate mock command output
  const getMockCommandOutput = (cmd) => {
    if (cmd.includes('nmap -sn')) {
      return `
Starting Nmap 7.93 ( https://nmap.org ) at 2023-05-08 14:30 EDT
Nmap scan report for 192.168.1.1
Host is up (0.0023s latency).
Nmap scan report for 192.168.1.10
Host is up (0.0000s latency).
Nmap scan report for 192.168.1.100
Host is up (0.0045s latency).
Nmap done: 256 IP addresses (3 hosts up) scanned in 2.34 seconds
`;
    } else if (cmd.includes('nmap') && cmd.includes('192.168.1.100')) {
      return `
Starting Nmap 7.93 ( https://nmap.org ) at 2023-05-08 14:32 EDT
Nmap scan report for 192.168.1.100
Host is up (0.0045s latency).
Not shown: 977 closed tcp ports (reset)
PORT     STATE SERVICE
21/tcp   open  ftp
22/tcp   open  ssh
23/tcp   open  telnet
25/tcp   open  smtp
53/tcp   open  domain
80/tcp   open  http
111/tcp  open  rpcbind
139/tcp  open  netbios-ssn
445/tcp  open  microsoft-ds
512/tcp  open  exec
513/tcp  open  login
514/tcp  open  shell
1099/tcp open  rmiregistry
1524/tcp open  ingreslock
2049/tcp open  nfs
2121/tcp open  ccproxy-ftp
3306/tcp open  mysql
5432/tcp open  postgresql
5900/tcp open  vnc
6000/tcp open  X11
6667/tcp open  irc
8009/tcp open  ajp13
8180/tcp open  unknown

Nmap done: 1 IP address (1 host up) scanned in 0.24 seconds
`;
    } else if (cmd.includes('ip addr')) {
      return `
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 08:00:27:c0:f3:21 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.10/24 brd 192.168.1.255 scope global dynamic noprefixroute eth0
       valid_lft 86389sec preferred_lft 86389sec
    inet6 fe80::a00:27ff:fec0:f321/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
`;
    } else {
      return `Command not found or not implemented in this demo.`;
    }
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

  if (!lab) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        Lab not found.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Lab header */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 3
      }}>
        <Box sx={{ width: '100%' }}>
          <Button
            component={Link}
            to="/labs"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 1 }}
            size={isMobile ? "small" : "medium"}
          >
            Back to Labs
          </Button>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              lineHeight: { xs: 1.3, sm: 1.4 }
            }}
          >
            {lab.title}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            <Chip
              icon={<InfoIcon />}
              label={`Difficulty: ${lab.difficulty.charAt(0).toUpperCase() + lab.difficulty.slice(1)}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
            <Chip
              icon={<InfoIcon />}
              label={`Estimated Time: ${lab.estimatedTime} min`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
            <Chip
              icon={<InfoIcon />}
              label={`Environment: ${lab.environmentType.charAt(0).toUpperCase() + lab.environmentType.slice(1)}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 2, sm: 0 }, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadIcon />}
            onClick={handleOpenSubmitDialog}
            sx={{ ml: { xs: 0, sm: 1 } }}
            size={isMobile ? "small" : "medium"}
          >
            Submit Lab
          </Button>
        </Box>
      </Box>

      {/* Progress indicator */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Lab Progress
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            fontWeight="bold"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            {progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: { xs: 6, sm: 8 },
            borderRadius: { xs: 3, sm: 4 },
            mt: 1
          }}
        />
      </Paper>

      {/* Lab content */}
      <Grid container spacing={3} direction={isMobile ? 'column-reverse' : 'row'}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                minHeight: { xs: '48px', md: '64px' },
                '& .MuiTab-root': {
                  minHeight: { xs: '48px', md: '64px' },
                  py: { xs: 1, md: 2 }
                }
              }}
            >
              <Tab
                label="Instructions"
                icon={<DescriptionIcon />}
                iconPosition="start"
                sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
              />
              <Tab
                label="Steps"
                icon={<AssignmentIcon />}
                iconPosition="start"
                sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
              />
              <Tab
                label="Resources"
                icon={<InfoIcon />}
                iconPosition="start"
                sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
              />
            </Tabs>

            {/* Instructions tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ typography: 'body1' }}>
                <ReactMarkdown>
                  {lab.instructions}
                </ReactMarkdown>
              </Box>
            </TabPanel>

            {/* Steps tab */}
            <TabPanel value={tabValue} index={1}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {lab.steps.map((step, index) => (
                  <Step key={step.title}>
                    <StepLabel>{step.title}</StepLabel>
                    <StepContent>
                      <Box sx={{ typography: 'body1' }}>
                        <ReactMarkdown>
                          {step.content}
                        </ReactMarkdown>
                      </Box>
                      <Box sx={{ mb: 2, mt: 1 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={index === lab.steps.length - 1 ? handleOpenSubmitDialog : handleNext}
                            sx={{ mt: 1, mr: 1 }}
                            size={isMobile ? "small" : "medium"}
                          >
                            {index === lab.steps.length - 1 ? 'Complete' : 'Continue'}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                            size={isMobile ? "small" : "medium"}
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
            <TabPanel value={tabValue} index={2}>
              <List>
                {lab.resources.map((resource, index) => (
                  <ListItem key={index} divider={index < lab.resources.length - 1}>
                    <ListItemIcon>
                      {resource.type === 'pdf' && <DescriptionIcon color="error" />}
                      {resource.type === 'article' && <DescriptionIcon color="primary" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={resource.title}
                      secondary={resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      component="a"
                      href={resource.url}
                      target="_blank"
                    >
                      View
                    </Button>
                  </ListItem>
                ))}
              </List>
            </TabPanel>
          </Paper>

          {/* Lab submission info - Hide on mobile if using mobile lab interface */}
          {(!isMobile || tabValue !== 1) && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Submission Requirements
              </Typography>
              <Typography variant="body2" paragraph>
                {lab.submissionInstructions}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<UploadIcon />}
                  onClick={handleOpenSubmitDialog}
                  size={isMobile ? "small" : "medium"}
                >
                  Submit Lab
                </Button>
              </Box>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Lab environment */}
          <Paper sx={{ mb: 3 }}>
            {isMobile ? (
              /* Mobile Lab Interface */
              <MobileLabInterface
                lab={{
                  title: lab.title,
                  description: lab.description,
                  objectives: lab.instructions.match(/## Objectives\n\n([\s\S]*?)(?=\n\n##|$)/)?.[1]
                    .split('\n')
                    .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().match(/^\d+\./))
                    .map(line => line.replace(/^[*-]\s+/, '').replace(/^\d+\.\s+/, ''))
                    .filter(Boolean) || [],
                  steps: lab.steps.map(step => ({
                    title: step.title,
                    description: step.content
                  }))
                }}
                onComplete={() => {
                  setProgress(100);
                  handleOpenSubmitDialog();
                }}
              />
            ) : (
              /* Desktop Lab Interface */
              <>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Lab Environment
                  </Typography>
                  <Box>
                    {labStatus === 'stopped' && (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<PlayArrowIcon />}
                        onClick={handleStartLab}
                      >
                        Start Lab
                      </Button>
                    )}

                    {labStatus === 'starting' && (
                      <Button
                        variant="contained"
                        color="primary"
                        disabled
                      >
                        Starting...
                      </Button>
                    )}

                    {labStatus === 'running' && (
                      <>
                        <Button
                          variant="outlined"
                          color="warning"
                          startIcon={<RefreshIcon />}
                          onClick={handleResetLab}
                          sx={{ mr: 1 }}
                        >
                          Reset
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<StopIcon />}
                          onClick={handleStopLab}
                        >
                          Stop Lab
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>

                {labStatus === 'stopped' && (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <ComputerIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      Lab environment is not running.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click "Start Lab" to launch the virtual environment.
                    </Typography>
                  </Box>
                )}

                {labStatus === 'starting' && (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      Starting lab environment...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This may take a few moments.
                    </Typography>
                  </Box>
                )}

                {labStatus === 'running' && (
                  <Box sx={{ p: 0 }}>
                    <Box
                      sx={{
                        bgcolor: 'black',
                        color: 'lightgreen',
                        fontFamily: 'monospace',
                        p: 2,
                        height: 300,
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {terminalOutput}
                    </Box>
                    <Box component="form" onSubmit={handleCommandSubmit} sx={{ display: 'flex', borderTop: 1, borderColor: 'divider' }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter command..."
                        value={command}
                        onChange={handleCommandChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                          }
                        }}
                        InputProps={{
                          startAdornment: <Box component="span" sx={{ color: 'success.main', mr: 1 }}>$</Box>,
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ borderRadius: 0 }}
                      >
                        Run
                      </Button>
                    </Box>
                  </Box>
                )}

                {labStatus === 'error' && (
                  <Box sx={{ p: 3 }}>
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      Failed to start lab environment. Please try again or contact support.
                    </Alert>
                  </Box>
                )}
              </>
            )}
          </Paper>

          {/* Tools list */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Required Tools
            </Typography>
            <List dense>
              {lab.tools.map((tool, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <TerminalIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={tool} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Submission dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={handleCloseSubmitDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Submit Lab: {lab.title}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Submission Requirements</AlertTitle>
            {lab.submissionInstructions}
          </Alert>

          <TextField
            label="Lab Report"
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            placeholder="Enter your lab report here..."
            value={submission.content}
            onChange={handleSubmissionChange}
            sx={{ mb: 3 }}
          />

          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            component="label"
          >
            Upload Screenshots
            <input
              type="file"
              hidden
              accept="image/*"
              multiple
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmitDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitLab}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LabDetail;
