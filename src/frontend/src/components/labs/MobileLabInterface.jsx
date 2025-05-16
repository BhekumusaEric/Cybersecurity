import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  Button,
  TextField,
  CircularProgress,
  useMediaQuery,
  Fab,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Menu as MenuIcon, 
  PlayArrow as PlayIcon, 
  Stop as StopIcon, 
  Refresh as RefreshIcon, 
  Fullscreen as FullscreenIcon, 
  FullscreenExit as FullscreenExitIcon,
  Description as DescriptionIcon,
  Terminal as TerminalIcon,
  Code as CodeIcon,
  Assignment as AssignmentIcon,
  Help as HelpIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useOffline } from '../../context/OfflineContext';

const MobileLabInterface = ({ lab, onComplete }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { isOnline } = useOffline();
  
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [labStatus, setLabStatus] = useState('stopped'); // 'loading', 'running', 'stopped', 'error'
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'system', content: 'Terminal ready. Type "help" for available commands.' }
  ]);
  const [instructionsMinimized, setInstructionsMinimized] = useState(isSmallScreen);
  
  const terminalRef = useRef(null);
  const containerRef = useRef(null);

  // Scroll terminal to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Toggle drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Start lab
  const startLab = () => {
    if (!isOnline) {
      addTerminalOutput('system', 'Cannot start lab in offline mode. Please connect to the internet.');
      return;
    }
    
    setLabStatus('loading');
    addTerminalOutput('system', 'Starting lab environment...');
    
    // Simulate lab startup
    setTimeout(() => {
      setLabStatus('running');
      addTerminalOutput('system', 'Lab environment started successfully.');
      addTerminalOutput('system', 'Connected to Kali Linux instance.');
      addTerminalOutput('system', 'Type "help" for available commands or use the GUI interface.');
    }, 2000);
  };

  // Stop lab
  const stopLab = () => {
    setLabStatus('loading');
    addTerminalOutput('system', 'Stopping lab environment...');
    
    // Simulate lab shutdown
    setTimeout(() => {
      setLabStatus('stopped');
      addTerminalOutput('system', 'Lab environment stopped successfully.');
    }, 1500);
  };

  // Reset lab
  const resetLab = () => {
    if (labStatus === 'running') {
      addTerminalOutput('system', 'Resetting lab environment...');
      
      // Simulate lab reset
      setTimeout(() => {
        addTerminalOutput('system', 'Lab environment reset successfully.');
      }, 1500);
    } else {
      addTerminalOutput('system', 'Lab must be running to reset.');
    }
  };

  // Add output to terminal
  const addTerminalOutput = (type, content) => {
    setTerminalOutput(prev => [...prev, { type, content }]);
  };

  // Handle terminal input
  const handleTerminalInput = (e) => {
    setTerminalInput(e.target.value);
  };

  // Submit terminal command
  const submitCommand = (e) => {
    e.preventDefault();
    
    if (!terminalInput.trim()) return;
    
    // Add user input to terminal
    addTerminalOutput('user', terminalInput);
    
    // Process command
    processCommand(terminalInput);
    
    // Clear input
    setTerminalInput('');
  };

  // Process terminal command
  const processCommand = (command) => {
    const cmd = command.trim().toLowerCase();
    
    if (labStatus !== 'running' && !['help', 'clear', 'start'].includes(cmd)) {
      addTerminalOutput('system', 'Lab is not running. Start the lab first with "start" command.');
      return;
    }
    
    switch (cmd) {
      case 'help':
        addTerminalOutput('system', 'Available commands:');
        addTerminalOutput('system', '  help - Show this help message');
        addTerminalOutput('system', '  clear - Clear terminal');
        addTerminalOutput('system', '  start - Start lab environment');
        addTerminalOutput('system', '  stop - Stop lab environment');
        addTerminalOutput('system', '  reset - Reset lab environment');
        addTerminalOutput('system', '  ls - List files in current directory');
        addTerminalOutput('system', '  cd [dir] - Change directory');
        addTerminalOutput('system', '  nmap [options] - Network scanning tool');
        break;
      case 'clear':
        setTerminalOutput([{ type: 'system', content: 'Terminal cleared.' }]);
        break;
      case 'start':
        if (labStatus !== 'running') {
          startLab();
        } else {
          addTerminalOutput('system', 'Lab is already running.');
        }
        break;
      case 'stop':
        if (labStatus === 'running') {
          stopLab();
        } else {
          addTerminalOutput('system', 'Lab is not running.');
        }
        break;
      case 'reset':
        resetLab();
        break;
      case 'ls':
        addTerminalOutput('system', 'Desktop  Documents  Downloads  Music  Pictures  Videos');
        break;
      case 'cd':
        addTerminalOutput('system', 'Changed directory to: /home/kali');
        break;
      default:
        if (cmd.startsWith('nmap')) {
          addTerminalOutput('system', 'Starting Nmap scan...');
          setTimeout(() => {
            addTerminalOutput('system', 'Nmap scan complete. Found 3 open ports on target system.');
          }, 1500);
        } else {
          addTerminalOutput('system', `Command not found: ${command}`);
        }
    }
  };

  // Toggle instructions panel
  const toggleInstructions = () => {
    setInstructionsMinimized(!instructionsMinimized);
  };

  // Render terminal output
  const renderTerminalOutput = () => {
    return terminalOutput.map((line, index) => (
      <Box key={index} sx={{ mb: 1, fontFamily: 'monospace', fontSize: '0.9rem' }}>
        {line.type === 'user' ? (
          <Box sx={{ display: 'flex' }}>
            <Typography component="span" sx={{ color: theme.palette.success.main, mr: 1 }}>
              kali@lab:~$
            </Typography>
            <Typography component="span">{line.content}</Typography>
          </Box>
        ) : (
          <Typography 
            sx={{ 
              color: line.type === 'error' ? theme.palette.error.main : 'inherit',
              fontWeight: line.type === 'system' ? 'bold' : 'normal'
            }}
          >
            {line.content}
          </Typography>
        )}
      </Box>
    ));
  };

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        minHeight: isFullscreen ? '100vh' : '500px',
        maxHeight: isFullscreen ? '100vh' : '80vh',
        overflow: 'hidden',
        bgcolor: theme.palette.background.default,
        borderRadius: isFullscreen ? 0 : 1,
        position: 'relative'
      }}
    >
      {/* Lab Header */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 1, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={toggleDrawer} size="small" sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 'bold' }}>
            {lab?.title || 'Lab Environment'}
          </Typography>
        </Box>
        
        <Box>
          {labStatus === 'stopped' && (
            <Tooltip title="Start Lab">
              <IconButton 
                color="success" 
                onClick={startLab}
                disabled={!isOnline}
                size="small"
              >
                <PlayIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {labStatus === 'running' && (
            <Tooltip title="Stop Lab">
              <IconButton 
                color="error" 
                onClick={stopLab}
                size="small"
                sx={{ mr: 1 }}
              >
                <StopIcon />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Reset Lab">
            <span>
              <IconButton 
                onClick={resetLab}
                disabled={labStatus !== 'running'}
                size="small"
                sx={{ mr: 1 }}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          
          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton 
              onClick={toggleFullscreen}
              size="small"
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Instructions Panel (collapsible) */}
        <Box
          sx={{
            width: instructionsMinimized ? '40px' : { xs: '100%', sm: '300px' },
            display: instructionsMinimized ? { xs: 'none', sm: 'block' } : 'block',
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: 'width 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1
          }}
        >
          {!instructionsMinimized ? (
            <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Lab Instructions
              </Typography>
              <Typography variant="body2" paragraph>
                {lab?.description || 'No description available for this lab.'}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                Objectives:
              </Typography>
              <List dense>
                {lab?.objectives?.map((objective, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <AssignmentIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={objective} />
                  </ListItem>
                )) || (
                  <ListItem>
                    <ListItemText primary="No objectives specified." />
                  </ListItem>
                )}
              </List>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                Steps:
              </Typography>
              <List dense>
                {lab?.steps?.map((step, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={`${index + 1}. ${step.title}`} 
                      secondary={step.description}
                    />
                  </ListItem>
                )) || (
                  <ListItem>
                    <ListItemText primary="No steps specified." />
                  </ListItem>
                )}
              </List>
              
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={toggleInstructions}
                sx={{ mt: 2, display: { xs: 'flex', sm: 'none' } }}
              >
                Close Instructions
              </Button>
            </Box>
          ) : (
            <Box 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                pt: 2
              }}
            >
              <Tooltip title="Show Instructions">
                <IconButton onClick={toggleInstructions}>
                  <ChevronRightIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Lab Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tabs */}
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              borderBottom: `1px solid ${theme.palette.divider}`,
              minHeight: '48px',
              '& .MuiTab-root': {
                minHeight: '48px',
                py: 1
              }
            }}
          >
            <Tab label="Terminal" icon={<TerminalIcon />} iconPosition="start" />
            <Tab label="GUI" icon={<CodeIcon />} iconPosition="start" />
            <Tab label="Resources" icon={<DescriptionIcon />} iconPosition="start" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
            {/* Terminal Tab */}
            <Box 
              sx={{ 
                display: activeTab === 0 ? 'flex' : 'none',
                flexDirection: 'column',
                height: '100%',
                p: 2,
                bgcolor: theme.palette.mode === 'dark' ? '#000' : '#1e1e1e',
                color: theme.palette.mode === 'dark' ? '#fff' : '#f0f0f0'
              }}
            >
              {labStatus === 'loading' ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Box 
                    ref={terminalRef}
                    sx={{ 
                      flexGrow: 1, 
                      overflow: 'auto',
                      mb: 2,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#2d2d2d'
                    }}
                  >
                    {renderTerminalOutput()}
                  </Box>
                  
                  <Box component="form" onSubmit={submitCommand}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter command..."
                      value={terminalInput}
                      onChange={handleTerminalInput}
                      disabled={labStatus === 'loading'}
                      InputProps={{
                        sx: { 
                          fontFamily: 'monospace',
                          color: theme.palette.mode === 'dark' ? '#fff' : '#f0f0f0',
                          bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#3d3d3d'
                        }
                      }}
                      size="small"
                    />
                  </Box>
                </>
              )}
            </Box>

            {/* GUI Tab */}
            <Box 
              sx={{ 
                display: activeTab === 1 ? 'flex' : 'none',
                flexDirection: 'column',
                height: '100%',
                p: 2
              }}
            >
              {labStatus === 'running' ? (
                <iframe
                  src="about:blank"
                  title="Lab GUI"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    border: 'none',
                    backgroundColor: '#f5f5f5'
                  }}
                  sandbox="allow-same-origin allow-scripts allow-forms"
                />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Lab Environment Not Running
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Start the lab to access the GUI interface
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<PlayIcon />}
                    onClick={startLab}
                    disabled={!isOnline || labStatus === 'loading'}
                    sx={{ mt: 2 }}
                  >
                    Start Lab
                  </Button>
                </Box>
              )}
            </Box>

            {/* Resources Tab */}
            <Box 
              sx={{ 
                display: activeTab === 2 ? 'flex' : 'none',
                flexDirection: 'column',
                height: '100%',
                p: 2,
                overflow: 'auto'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Lab Resources
              </Typography>
              
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Kali Linux Cheat Sheet" 
                    secondary="Common commands and tools"
                  />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Nmap Reference Guide" 
                    secondary="Network scanning tool documentation"
                  />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Metasploit Framework Guide" 
                    secondary="Exploitation framework documentation"
                  />
                </ListItem>
              </List>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Drawer for mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 300,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Lab Menu
          </Typography>
        </Box>
        
        <Divider />
        
        <List>
          <ListItem button onClick={() => { setActiveTab(0); toggleDrawer(); }}>
            <ListItemIcon>
              <TerminalIcon />
            </ListItemIcon>
            <ListItemText primary="Terminal" />
          </ListItem>
          <ListItem button onClick={() => { setActiveTab(1); toggleDrawer(); }}>
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText primary="GUI Interface" />
          </ListItem>
          <ListItem button onClick={() => { setActiveTab(2); toggleDrawer(); }}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Resources" />
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          <ListItem button onClick={() => { toggleInstructions(); toggleDrawer(); }}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Instructions" />
          </ListItem>
          <ListItem button onClick={() => { onComplete && onComplete(); toggleDrawer(); }}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Mark as Complete" />
          </ListItem>
          <ListItem button onClick={toggleDrawer}>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </ListItem>
        </List>
      </Drawer>

      {/* Show instructions button (mobile) */}
      {instructionsMinimized && (
        <Fab
          color="primary"
          size="small"
          onClick={toggleInstructions}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' }
          }}
        >
          <AssignmentIcon />
        </Fab>
      )}
    </Box>
  );
};

export default MobileLabInterface;
