import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Card,
  CardContent,
  Badge
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Download as DownloadIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

// Custom tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
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

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    profilePicture: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activities, setActivities] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // In a real app, this would be an API call
        // For now, we'll simulate with setTimeout and mock data
        setTimeout(() => {
          // Mock user data
          const mockUser = {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            bio: 'Cybersecurity enthusiast with a passion for ethical hacking and network security. Currently working as a security analyst and pursuing advanced certifications in penetration testing.',
            profilePicture: 'https://via.placeholder.com/150',
            role: 'student',
            lastLogin: '2023-05-08T14:30:00Z'
          };

          // Mock activities
          const mockActivities = [
            {
              id: '1',
              type: 'course_progress',
              title: 'Completed Module: Introduction to Ethical Hacking',
              date: '2023-05-07T15:30:00Z',
              details: {
                courseId: '1',
                courseName: 'Ethical Hacking Fundamentals',
                moduleId: '1',
                moduleName: 'Introduction to Ethical Hacking'
              }
            },
            {
              id: '2',
              type: 'assessment',
              title: 'Passed Quiz: Ethical Hacking Fundamentals',
              date: '2023-05-05T10:15:00Z',
              details: {
                assessmentId: '1',
                assessmentName: 'Introduction to Ethical Hacking Quiz',
                score: 85,
                passed: true
              }
            },
            {
              id: '3',
              type: 'lab',
              title: 'Completed Lab: Network Scanning with Nmap',
              date: '2023-05-03T14:45:00Z',
              details: {
                labId: '1',
                labName: 'Network Scanning with Nmap',
                grade: 92
              }
            },
            {
              id: '4',
              type: 'course_enrollment',
              title: 'Enrolled in Course: Ethical Hacking Fundamentals',
              date: '2023-05-01T09:00:00Z',
              details: {
                courseId: '1',
                courseName: 'Ethical Hacking Fundamentals'
              }
            }
          ];

          // Mock certificates
          const mockCertificates = [
            {
              id: '1',
              title: 'Ethical Hacking Fundamentals',
              issueDate: '2023-04-15T00:00:00Z',
              expiryDate: '2026-04-15T00:00:00Z',
              credentialId: 'EHF-12345',
              courseId: '1',
              downloadUrl: '#'
            }
          ];

          // Mock achievements
          const mockAchievements = [
            {
              id: '1',
              title: 'First Lab Completed',
              description: 'Successfully completed your first hands-on lab',
              date: '2023-05-03T14:45:00Z',
              icon: 'code'
            },
            {
              id: '2',
              title: 'Perfect Score',
              description: 'Achieved 100% on an assessment',
              date: '2023-05-05T10:15:00Z',
              icon: 'assessment'
            },
            {
              id: '3',
              title: 'Course Pioneer',
              description: 'Among the first 100 students to enroll in a course',
              date: '2023-05-01T09:00:00Z',
              icon: 'school'
            }
          ];

          setProfileData({
            name: mockUser.name,
            email: mockUser.email,
            bio: mockUser.bio,
            profilePicture: mockUser.profilePicture
          });

          setActivities(mockActivities);
          setCertificates(mockCertificates);
          setAchievements(mockAchievements);

          setLoading(false);
        }, 1000);

      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again.');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);

    // Reset form if canceling edit
    if (editMode) {
      setProfileData({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        profilePicture: user?.profilePicture || ''
      });
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handlePasswordDialogOpen = () => {
    setPasswordDialogOpen(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate with setTimeout
      setTimeout(() => {
        // Update user context
        updateProfile(profileData);

        setEditMode(false);
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPasswordError('');

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate with setTimeout
      setTimeout(() => {
        setPasswordDialogOpen(false);
        setIsSubmitting(false);

        // Show success message
        setError('Password updated successfully');
      }, 1000);
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordError('Failed to update password. Please check your current password and try again.');
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'course_progress':
      case 'course_enrollment':
        return <SchoolIcon color="primary" />;
      case 'assessment':
        return <AssignmentIcon color="secondary" />;
      case 'lab':
        return <CodeIcon color="success" />;
      default:
        return <CheckCircleIcon />;
    }
  };

  // Get icon for achievement
  const getAchievementIcon = (icon) => {
    switch (icon) {
      case 'code':
        return <CodeIcon />;
      case 'assessment':
        return <AssignmentIcon />;
      case 'school':
        return <SchoolIcon />;
      default:
        return <EmojiEventsIcon />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={48} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={profileData.profilePicture}
                alt={profileData.name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />

              {!editMode ? (
                <>
                  <Typography variant="h5" gutterBottom>
                    {profileData.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {profileData.email}
                  </Typography>
                  <Chip
                    label="Student"
                    color="primary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </>
              ) : (
                <Typography variant="h6" gutterBottom>
                  Edit Profile
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {!editMode ? (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  About Me
                </Typography>
                <Typography variant="body2" paragraph>
                  {profileData.bio || 'No bio provided.'}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditToggle}
                  >
                    Edit Profile
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<LockIcon />}
                    onClick={handlePasswordDialogOpen}
                  >
                    Change Password
                  </Button>
                </Box>
              </>
            ) : (
              <form onSubmit={handleProfileSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  margin="normal"
                  multiline
                  rows={4}
                />

                <TextField
                  fullWidth
                  label="Profile Picture URL"
                  name="profilePicture"
                  value={profileData.profilePicture}
                  onChange={handleProfileChange}
                  margin="normal"
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleEditToggle}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </Box>
              </form>
            )}
          </Paper>

          {/* Achievements Card */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Achievements
            </Typography>

            {achievements.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No achievements yet.
              </Typography>
            ) : (
              <List>
                {achievements.map((achievement) => (
                  <ListItem key={achievement.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getAchievementIcon(achievement.icon)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={achievement.title}
                      secondary={
                        <>
                          {achievement.description}
                          <br />
                          {formatDate(achievement.date)}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Activity" icon={<CheckCircleIcon />} iconPosition="start" />
              <Tab label="Certificates" icon={<EmojiEventsIcon />} iconPosition="start" />
              <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
            </Tabs>

            {/* Activity Tab */}
            <TabPanel value={tabValue} index={0}>
              {activities.length === 0 ? (
                <Alert severity="info">
                  No recent activity to display.
                </Alert>
              ) : (
                <List>
                  {activities.map((activity) => (
                    <ListItem key={activity.id} divider>
                      <ListItemIcon>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.title}
                        secondary={formatDate(activity.date)}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </TabPanel>

            {/* Certificates Tab */}
            <TabPanel value={tabValue} index={1}>
              {certificates.length === 0 ? (
                <Alert severity="info">
                  You haven't earned any certificates yet. Complete courses to earn certificates.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {certificates.map((certificate) => (
                    <Grid item xs={12} sm={6} key={certificate.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {certificate.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Issued: {formatDate(certificate.issueDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Credential ID: {certificate.credentialId}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="outlined"
                              startIcon={<DownloadIcon />}
                              href={certificate.downloadUrl}
                            >
                              Download
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Account Security
              </Typography>

              <List>
                <ListItem divider>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Address"
                    secondary={profileData.email}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleEditToggle}
                    >
                      Change
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem divider>
                  <ListItemIcon>
                    <LockIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Password"
                    secondary="Last changed: Never"
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handlePasswordDialogOpen}
                    >
                      Change
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Account Type"
                    secondary="Student"
                  />
                </ListItem>
              </List>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Login History
              </Typography>

              <List>
                <ListItem divider>
                  <ListItemText
                    primary="Last login"
                    secondary={formatDate(user?.lastLogin || new Date())}
                  />
                </ListItem>
              </List>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={handlePasswordSubmit}>
          <DialogContent>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type={showPassword.currentPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => togglePasswordVisibility('currentPassword')}
                    edge="end"
                  >
                    {showPassword.currentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />

            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type={showPassword.newPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => togglePasswordVisibility('newPassword')}
                    edge="end"
                  >
                    {showPassword.newPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type={showPassword.confirmPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    edge="end"
                  >
                    {showPassword.confirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePasswordDialogClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              Update Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Profile;
