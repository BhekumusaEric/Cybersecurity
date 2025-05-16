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
import api from '../../services/api';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const [courseProgress, setCourseProgress] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [moduleStats, setModuleStats] = useState({ completed: 0, inProgress: 0, notStarted: 0 });
  const [progressData, setProgressData] = useState({
    completedLabs: 0,
    totalLabs: 0,
    passedQuizzes: 0,
    totalQuizzes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch user progress
        const progressResponse = await api.get('/api/users/progress');
        if (progressResponse.data.success) {
          setCourseProgress(progressResponse.data.overallProgress || 0);
          setModuleStats({
            completed: progressResponse.data.completedModules || 0,
            inProgress: progressResponse.data.inProgressModules || 0,
            notStarted: progressResponse.data.notStartedModules || 0
          });
          setProgressData({
            completedLabs: progressResponse.data.completedLabs || 0,
            totalLabs: progressResponse.data.totalLabs || 0,
            passedQuizzes: progressResponse.data.passedQuizzes || 0,
            totalQuizzes: progressResponse.data.totalQuizzes || 0
          });
        }

        // Fetch upcoming deadlines
        const deadlinesResponse = await api.get('/api/users/deadlines');
        if (deadlinesResponse.data.success) {
          setUpcomingDeadlines(deadlinesResponse.data.deadlines || []);
        }

        // Fetch recent activities
        const activitiesResponse = await api.get('/api/users/activities');
        if (activitiesResponse.data.success) {
          setRecentActivities(activitiesResponse.data.activities || []);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data
  const chartData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [
          moduleStats.completed,
          moduleStats.inProgress,
          moduleStats.notStarted
        ],
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
                    <Typography variant="h5" color="primary">
                      {moduleStats.completed}/{moduleStats.completed + moduleStats.inProgress + moduleStats.notStarted}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">Modules Completed</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="h5" color="primary">
                      {progressData.completedLabs}/{progressData.totalLabs}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">Labs Completed</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="h5" color="primary">
                      {progressData.passedQuizzes}/{progressData.totalQuizzes}
                    </Typography>
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
                      {courseProgress}%
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
