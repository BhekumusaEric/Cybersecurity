import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalAssessments: 0,
    activeUsers: 0
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching admin data
    const fetchAdminData = async () => {
      try {
        // This would be an actual API call in production
        setTimeout(() => {
          setStats({
            totalUsers: 156,
            totalCourses: 12,
            totalAssessments: 48,
            activeUsers: 89
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back, {currentUser?.displayName || 'Admin'}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin dashboard tabs">
          <Tab label="Overview" icon={<SettingsIcon />} iconPosition="start" />
          <Tab label="Users" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Courses" icon={<SchoolIcon />} iconPosition="start" />
          <Tab label="Assessments" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                <Typography variant="h6" color="text.secondary">Total Users</Typography>
                <Typography component="p" variant="h3" sx={{ flexGrow: 1, mt: 2 }}>
                  {stats.totalUsers}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {stats.activeUsers} active now
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                <Typography variant="h6" color="text.secondary">Courses</Typography>
                <Typography component="p" variant="h3" sx={{ flexGrow: 1, mt: 2 }}>
                  {stats.totalCourses}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    4 published this month
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                <Typography variant="h6" color="text.secondary">Assessments</Typography>
                <Typography component="p" variant="h3" sx={{ flexGrow: 1, mt: 2 }}>
                  {stats.totalAssessments}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    12 pending reviews
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                <Typography variant="h6" color="text.secondary">Security</Typography>
                <Typography component="p" variant="h3" sx={{ flexGrow: 1, mt: 2 }}>
                  Good
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No alerts
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<PersonIcon />}
                      fullWidth
                      onClick={() => navigate('/admin/users/new')}
                    >
                      Add New User
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<BookIcon />}
                      fullWidth
                      onClick={() => navigate('/admin/courses/new')}
                    >
                      Create Course
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<AssignmentIcon />}
                      fullWidth
                      onClick={() => navigate('/admin/assessments/new')}
                    >
                      Create Assessment
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<SecurityIcon />}
                      fullWidth
                      onClick={() => navigate('/admin/security')}
                    >
                      Security Settings
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="New user registered"
                      secondary="John Doe - 2 hours ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BookIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Course updated"
                      secondary="Web Application Security - 5 hours ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Assessment submitted"
                      secondary="Network Security Quiz - 1 day ago"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {tabValue !== 0 && (
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6">
            {tabValue === 1 && 'User Management'}
            {tabValue === 2 && 'Course Management'}
            {tabValue === 3 && 'Assessment Management'}
            {tabValue === 4 && 'Security Settings'}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            This section is under development.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default AdminDashboard;
