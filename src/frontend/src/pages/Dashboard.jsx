import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Paper,
  Chip
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Code as CodeIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const [courseProgress, setCourseProgress] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourseProgress(42);
      setUpcomingDeadlines([
        { id: 1, title: 'Network Scanning Quiz', dueDate: '2023-05-15', type: 'quiz' },
        { id: 2, title: 'OWASP Top 10 Lab', dueDate: '2023-05-18', type: 'lab' },
        { id: 3, title: 'Vulnerability Report', dueDate: '2023-05-20', type: 'assignment' }
      ]);
      setRecentActivities([
        { id: 1, title: 'Completed Linux Basics Quiz', date: '2023-05-05', type: 'quiz', result: 'Passed (85%)' },
        { id: 2, title: 'Submitted Reconnaissance Lab', date: '2023-05-03', type: 'lab', result: 'Pending Review' },
        { id: 3, title: 'Started Web App Hacking Module', date: '2023-05-01', type: 'module', result: 'In Progress' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Chart data
  const chartData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [5, 2, 5],
        backgroundColor: ['#4caf50', '#2196f3', '#e0e0e0'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.name || 'Student'}!
      </Typography>

      <Grid container spacing={3}>
        {/* Course Progress */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Course Progress
                </Typography>
                <Chip
                  label={`${courseProgress}% Complete`}
                  color="primary"
                  size="small"
                />
              </Box>

              <LinearProgress
                variant="determinate"
                value={courseProgress}
                sx={{ height: 10, borderRadius: 5, mb: 2 }}
              />

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="h5" color="primary">5/12</Typography>
                    <Typography variant="body2" color="textSecondary">Modules Completed</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="h5" color="primary">12/20</Typography>
                    <Typography variant="body2" color="textSecondary">Labs Completed</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="h5" color="primary">8/15</Typography>
                    <Typography variant="body2" color="textSecondary">Quizzes Passed</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  component={Link}
                  to="/courses"
                  endIcon={<ArrowForwardIcon />}
                >
                  Continue Learning
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Module Completion */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Module Completion
              </Typography>

              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ height: 200, width: '100%', position: 'relative' }}>
                  <Doughnut data={chartData} options={chartOptions} />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h4" component="p" color="primary">
                      42%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Overall
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Upcoming Deadlines
                </Typography>
              </Box>

              <List>
                {upcomingDeadlines.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <Chip
                        label={item.dueDate}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    }
                    sx={{ px: 0 }}
                  >
                    <ListItemIcon>
                      {item.type === 'quiz' && <AssignmentIcon color="primary" />}
                      {item.type === 'lab' && <CodeIcon color="primary" />}
                      {item.type === 'assignment' && <SchoolIcon color="primary" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      secondary={`Due: ${item.dueDate}`}
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  component={Link}
                  to="/assessments"
                  endIcon={<ArrowForwardIcon />}
                >
                  View All Deadlines
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Recent Activity
                </Typography>
              </Box>

              <List>
                {recentActivities.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <Chip
                        label={item.result}
                        size="small"
                        color={
                          item.result.includes('Passed') ? 'success' :
                          item.result.includes('Pending') ? 'warning' : 'primary'
                        }
                        variant="outlined"
                      />
                    }
                    sx={{ px: 0 }}
                  >
                    <ListItemIcon>
                      {item.type === 'quiz' && <AssignmentIcon color="primary" />}
                      {item.type === 'lab' && <CodeIcon color="primary" />}
                      {item.type === 'module' && <SchoolIcon color="primary" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      secondary={`Date: ${item.date}`}
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  component={Link}
                  to="/profile"
                  endIcon={<ArrowForwardIcon />}
                >
                  View All Activity
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
