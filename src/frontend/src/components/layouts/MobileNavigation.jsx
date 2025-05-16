import { useState } from 'react';
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Paper, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Box, 
  Typography,
  Divider,
  Avatar
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  School as SchoolIcon, 
  Code as CodeIcon, 
  Assignment as AssignmentIcon, 
  Person as PersonIcon, 
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme as useAppTheme } from '../../context/ThemeContext';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { mode, toggleTheme } = useAppTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Get the current route for the bottom navigation
  const getCurrentRoute = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/courses')) return 'courses';
    if (path.includes('/labs')) return 'labs';
    if (path.includes('/assessments')) return 'assessments';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const handleNavigation = (route) => {
    navigate(`/${route}`);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/dashboard',
      onClick: () => {
        navigate('/dashboard');
        setDrawerOpen(false);
      }
    },
    { 
      text: 'Courses', 
      icon: <SchoolIcon />, 
      path: '/courses',
      onClick: () => {
        navigate('/courses');
        setDrawerOpen(false);
      }
    },
    { 
      text: 'Labs', 
      icon: <CodeIcon />, 
      path: '/labs',
      onClick: () => {
        navigate('/labs');
        setDrawerOpen(false);
      }
    },
    { 
      text: 'Assessments', 
      icon: <AssignmentIcon />, 
      path: '/assessments',
      onClick: () => {
        navigate('/assessments');
        setDrawerOpen(false);
      }
    }
  ];

  // Add admin menu items if user is admin
  if (user && user.role === 'admin') {
    menuItems.push(
      { 
        text: 'Admin Dashboard', 
        icon: <DashboardIcon />, 
        path: '/admin',
        onClick: () => {
          navigate('/admin');
          setDrawerOpen(false);
        }
      }
    );
  }

  return (
    <>
      {/* Side Drawer */}
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
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Ethical Hacking LMS</Typography>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {user && (
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2 }}>{user.name ? user.name.charAt(0) : 'U'}</Avatar>
            <Box>
              <Typography variant="subtitle1">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            </Box>
          </Box>
        )}
        
        <Divider />
        
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={item.onClick}
              selected={location.pathname.startsWith(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Bottom Navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1100,
          display: { xs: 'block', md: 'none' }
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={getCurrentRoute()}
          onChange={(event, newValue) => {
            handleNavigation(newValue);
          }}
          showLabels
        >
          <BottomNavigationAction 
            label="Dashboard" 
            value="dashboard" 
            icon={<DashboardIcon />} 
          />
          <BottomNavigationAction 
            label="Courses" 
            value="courses" 
            icon={<SchoolIcon />} 
          />
          <BottomNavigationAction 
            label="Labs" 
            value="labs" 
            icon={<CodeIcon />} 
          />
          <BottomNavigationAction 
            label="Profile" 
            value="profile" 
            icon={<PersonIcon />} 
          />
          <BottomNavigationAction 
            label="Menu" 
            value="menu" 
            icon={<MenuIcon />} 
            onClick={toggleDrawer}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default MobileNavigation;
