import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  ProgressBar,
  Appbar,
  Avatar,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import { useNotification } from '../../context/NotificationContext';
import { fetchDashboardData } from '../../services/api/dashboardService';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { isOnline, offlineData } = useOffline();
  const { unreadCount } = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  
  // Fetch dashboard data
  const loadDashboardData = async () => {
    try {
      setError(null);
      
      if (isOnline) {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } else {
        // Use offline data
        setDashboardData({
          progress: offlineData.progress || {},
          recentCourses: offlineData.courses?.slice(0, 3) || [],
          upcomingLabs: offlineData.labs?.slice(0, 2) || [],
          announcements: [],
          stats: {
            coursesCompleted: 2,
            labsCompleted: 8,
            quizzesCompleted: 5,
            overallProgress: 0.35,
          },
        });
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Load data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [isOnline])
  );
  
  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };
  
  // Render loading state
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading dashboard...</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Dashboard" />
        <Appbar.Action 
          icon="bell" 
          onPress={() => navigation.navigate('Notifications')} 
          color={unreadCount > 0 ? theme.colors.notification : undefined}
        />
        {unreadCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </Appbar.Header>
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <Card.Content style={styles.welcomeCardContent}>
            <View style={styles.welcomeTextContainer}>
              <Title>Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</Title>
              <Paragraph>Continue your ethical hacking journey</Paragraph>
              
              {!isOnline && (
                <Chip 
                  icon="wifi-off" 
                  style={styles.offlineChip}
                  textStyle={{ color: '#fff' }}
                >
                  Offline Mode
                </Chip>
              )}
            </View>
            <Avatar.Text 
              size={60} 
              label={user?.name?.charAt(0) || 'S'} 
              color="#fff"
              style={{ backgroundColor: theme.colors.primary }}
            />
          </Card.Content>
        </Card>
        
        {/* Error Message */}
        {error && (
          <Card style={styles.errorCard}>
            <Card.Content>
              <View style={styles.errorContent}>
                <Icon name="alert-circle" size={24} color="#f44336" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </Card.Content>
          </Card>
        )}
        
        {/* Progress Overview */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Your Progress</Title>
            <View style={styles.progressContainer}>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Overall</Text>
                <ProgressBar 
                  progress={dashboardData?.stats?.overallProgress || 0} 
                  color={theme.colors.primary}
                  style={styles.progressBar}
                />
                <Text style={styles.progressPercentage}>
                  {Math.round((dashboardData?.stats?.overallProgress || 0) * 100)}%
                </Text>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Icon name="book-open-variant" size={24} color={theme.colors.primary} />
                  <Text style={styles.statValue}>{dashboardData?.stats?.coursesCompleted || 0}</Text>
                  <Text style={styles.statLabel}>Courses</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Icon name="console" size={24} color={theme.colors.primary} />
                  <Text style={styles.statValue}>{dashboardData?.stats?.labsCompleted || 0}</Text>
                  <Text style={styles.statLabel}>Labs</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Icon name="clipboard-check" size={24} color={theme.colors.primary} />
                  <Text style={styles.statValue}>{dashboardData?.stats?.quizzesCompleted || 0}</Text>
                  <Text style={styles.statLabel}>Quizzes</Text>
                </View>
              </View>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="text" 
              onPress={() => navigation.navigate('Profile')}
            >
              View Details
            </Button>
          </Card.Actions>
        </Card>
        
        {/* Continue Learning */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Continue Learning</Title>
            
            {dashboardData?.recentCourses?.length > 0 ? (
              dashboardData.recentCourses.map((course, index) => (
                <React.Fragment key={course.id}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
                  >
                    <View style={styles.courseItem}>
                      <View style={styles.courseIconContainer}>
                        <Icon 
                          name={course.icon || "book-open-variant"} 
                          size={32} 
                          color="#fff" 
                          style={styles.courseIcon}
                        />
                      </View>
                      <View style={styles.courseInfo}>
                        <Text style={styles.courseTitle}>{course.title}</Text>
                        <Text style={styles.courseProgress}>
                          {Math.round((course.progress || 0) * 100)}% Complete
                        </Text>
                        <ProgressBar 
                          progress={course.progress || 0} 
                          color={theme.colors.primary}
                          style={styles.courseProgressBar}
                        />
                      </View>
                      <Icon name="chevron-right" size={24} color="#757575" />
                    </View>
                  </TouchableOpacity>
                  {index < dashboardData.recentCourses.length - 1 && <Divider style={styles.divider} />}
                </React.Fragment>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="book-open-variant" size={48} color="#BDBDBD" />
                <Text style={styles.emptyStateText}>No courses in progress</Text>
                <Button 
                  mode="contained" 
                  onPress={() => navigation.navigate('Courses')}
                  style={styles.emptyStateButton}
                >
                  Browse Courses
                </Button>
              </View>
            )}
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="text" 
              onPress={() => navigation.navigate('Courses')}
            >
              View All Courses
            </Button>
          </Card.Actions>
        </Card>
        
        {/* Upcoming Labs */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Upcoming Labs</Title>
            
            {dashboardData?.upcomingLabs?.length > 0 ? (
              dashboardData.upcomingLabs.map((lab, index) => (
                <React.Fragment key={lab.id}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('LabDetail', { labId: lab.id })}
                  >
                    <View style={styles.labItem}>
                      <View style={styles.labIconContainer}>
                        <Icon 
                          name="console" 
                          size={32} 
                          color="#fff" 
                          style={styles.labIcon}
                        />
                      </View>
                      <View style={styles.labInfo}>
                        <Text style={styles.labTitle}>{lab.title}</Text>
                        <View style={styles.labMeta}>
                          <Text style={styles.labDifficulty}>
                            {lab.difficulty || 'Beginner'}
                          </Text>
                          <Text style={styles.labDuration}>
                            {lab.duration || '30 min'}
                          </Text>
                        </View>
                      </View>
                      <Icon name="chevron-right" size={24} color="#757575" />
                    </View>
                  </TouchableOpacity>
                  {index < dashboardData.upcomingLabs.length - 1 && <Divider style={styles.divider} />}
                </React.Fragment>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="console" size={48} color="#BDBDBD" />
                <Text style={styles.emptyStateText}>No upcoming labs</Text>
                <Button 
                  mode="contained" 
                  onPress={() => navigation.navigate('Labs')}
                  style={styles.emptyStateButton}
                >
                  Browse Labs
                </Button>
              </View>
            )}
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="text" 
              onPress={() => navigation.navigate('Labs')}
            >
              View All Labs
            </Button>
          </Card.Actions>
        </Card>
        
        {/* Announcements */}
        {isOnline && dashboardData?.announcements?.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Announcements</Title>
              
              {dashboardData.announcements.map((announcement, index) => (
                <React.Fragment key={announcement.id}>
                  <View style={styles.announcementItem}>
                    <View style={styles.announcementHeader}>
                      <Text style={styles.announcementTitle}>{announcement.title}</Text>
                      <Text style={styles.announcementDate}>{announcement.date}</Text>
                    </View>
                    <Paragraph style={styles.announcementContent}>
                      {announcement.content}
                    </Paragraph>
                  </View>
                  {index < dashboardData.announcements.length - 1 && <Divider style={styles.divider} />}
                </React.Fragment>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  welcomeCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  welcomeCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTextContainer: {
    flex: 1,
  },
  offlineChip: {
    backgroundColor: '#FF9800',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  errorCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#FFEBEE',
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#f44336',
    marginLeft: 8,
    flex: 1,
  },
  card: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
    color: '#757575',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  courseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseIcon: {
    textAlign: 'center',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  courseProgress: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  courseProgressBar: {
    height: 4,
    borderRadius: 2,
  },
  divider: {
    marginVertical: 8,
  },
  labItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  labIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  labIcon: {
    textAlign: 'center',
  },
  labInfo: {
    flex: 1,
  },
  labTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  labMeta: {
    flexDirection: 'row',
  },
  labDifficulty: {
    fontSize: 12,
    color: '#757575',
    marginRight: 16,
  },
  labDuration: {
    fontSize: 12,
    color: '#757575',
  },
  announcementItem: {
    paddingVertical: 12,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  announcementDate: {
    fontSize: 12,
    color: '#757575',
  },
  announcementContent: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    marginTop: 16,
    marginBottom: 16,
    color: '#757575',
  },
  emptyStateButton: {
    marginTop: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
