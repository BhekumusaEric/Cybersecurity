import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import {
  Text,
  Appbar,
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  List,
  Switch,
  ActivityIndicator,
  Chip,
  ProgressBar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import { useNotification } from '../../context/NotificationContext';
import { fetchUserProgress, fetchUserCertificates } from '../../services/api/dashboardService';
import { updateProfile } from '../../services/api/authService';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, biometricsAvailable, enableBiometricLogin, disableBiometricLogin } = useAuth();
  const { theme, themeMode, setTheme } = useTheme();
  const { isOnline } = useOffline();
  const { permissionStatus, requestPermissions } = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(themeMode === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(permissionStatus === 'granted');
  
  // Load profile data
  const loadProfileData = async () => {
    try {
      setError(null);
      
      if (isOnline) {
        // Fetch user progress
        const progressData = await fetchUserProgress();
        
        // Fetch certificates
        const certificatesData = await fetchUserCertificates();
        
        setProfileData(progressData);
        setCertificates(certificatesData);
      } else {
        // Use offline data
        setProfileData({
          coursesCompleted: 2,
          coursesInProgress: 3,
          totalCourses: 12,
          labsCompleted: 8,
          totalLabs: 24,
          quizzesCompleted: 5,
          totalQuizzes: 15,
          overallProgress: 0.35,
          totalPoints: 1250,
          rank: 'Apprentice',
          nextRank: 'Hacker',
          pointsToNextRank: 750,
        });
        
        setCertificates([
          {
            id: 1,
            title: 'Introduction to Ethical Hacking',
            issueDate: '2023-06-15',
            imageUrl: 'https://example.com/certificates/1.jpg',
          },
          {
            id: 2,
            title: 'Network Scanning Fundamentals',
            issueDate: '2023-07-22',
            imageUrl: 'https://example.com/certificates/2.jpg',
          },
        ]);
      }
      
      // Check if biometrics are enabled
      const checkBiometrics = async () => {
        try {
          // This would be a real check in production
          setBiometricsEnabled(biometricsAvailable);
        } catch (error) {
          console.log('Check biometrics error:', error);
        }
      };
      
      checkBiometrics();
    } catch (err) {
      console.error('Error loading profile data:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Load data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadProfileData();
    }, [isOnline])
  );
  
  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadProfileData();
  };
  
  // Handle profile picture change
  const handleChangeProfilePicture = () => {
    const options = {
      title: 'Select Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      includeBase64: true,
    };
    
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Failed to select image. Please try again.');
      } else {
        // Upload profile picture
        const source = { uri: response.assets[0].uri };
        
        // This would be a real API call in production
        Alert.alert('Success', 'Profile picture updated successfully.');
      }
    });
  };
  
  // Handle biometrics toggle
  const handleBiometricsToggle = async (value) => {
    try {
      if (value) {
        // Enable biometrics
        const success = await enableBiometricLogin(user.email, 'password123'); // In a real app, you'd use the actual password
        
        if (success) {
          setBiometricsEnabled(true);
          Alert.alert('Success', 'Biometric login enabled successfully.');
        } else {
          Alert.alert('Error', 'Failed to enable biometric login. Please try again.');
        }
      } else {
        // Disable biometrics
        const success = await disableBiometricLogin();
        
        if (success) {
          setBiometricsEnabled(false);
          Alert.alert('Success', 'Biometric login disabled successfully.');
        } else {
          Alert.alert('Error', 'Failed to disable biometric login. Please try again.');
        }
      }
    } catch (error) {
      console.log('Biometrics toggle error:', error);
      Alert.alert('Error', 'Failed to toggle biometric login. Please try again.');
    }
  };
  
  // Handle dark mode toggle
  const handleDarkModeToggle = (value) => {
    setDarkModeEnabled(value);
    setTheme(value ? 'dark' : 'light');
  };
  
  // Handle notifications toggle
  const handleNotificationsToggle = async (value) => {
    try {
      if (value) {
        // Request notification permissions
        await requestPermissions();
        setNotificationsEnabled(true);
      } else {
        // This would open notification settings in a real app
        Alert.alert(
          'Disable Notifications',
          'To disable notifications, please go to your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {} }
          ]
        );
      }
    } catch (error) {
      console.log('Notifications toggle error:', error);
      Alert.alert('Error', 'Failed to toggle notifications. Please try again.');
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.log('Logout error:', error);
            Alert.alert('Error', 'Failed to log out. Please try again.');
          }
        }}
      ]
    );
  };
  
  // Render loading state
  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading profile...</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Profile" />
        <Appbar.Action icon="cog" onPress={() => navigation.navigate('Settings')} />
      </Appbar.Header>
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleChangeProfilePicture}>
            <Avatar.Image
              size={100}
              source={user?.avatar ? { uri: user.avatar } : require('../../assets/default-avatar.png')}
              style={styles.avatar}
            />
            <View style={styles.editAvatarButton}>
              <Icon name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            
            {profileData?.rank && (
              <Chip icon="trophy" style={styles.rankChip}>
                {profileData.rank}
              </Chip>
            )}
          </View>
        </View>
        
        {/* Progress Overview */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Your Progress</Title>
            
            <View style={styles.progressItem}>
              <View style={styles.progressLabelContainer}>
                <Text style={styles.progressLabel}>Overall Progress</Text>
                <Text style={styles.progressValue}>
                  {Math.round((profileData?.overallProgress || 0) * 100)}%
                </Text>
              </View>
              <ProgressBar
                progress={profileData?.overallProgress || 0}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {profileData?.coursesCompleted || 0}/{profileData?.totalCourses || 0}
                </Text>
                <Text style={styles.statLabel}>Courses</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {profileData?.labsCompleted || 0}/{profileData?.totalLabs || 0}
                </Text>
                <Text style={styles.statLabel}>Labs</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {profileData?.quizzesCompleted || 0}/{profileData?.totalQuizzes || 0}
                </Text>
                <Text style={styles.statLabel}>Quizzes</Text>
              </View>
            </View>
            
            {profileData?.pointsToNextRank && (
              <View style={styles.nextRankContainer}>
                <Text style={styles.nextRankText}>
                  {profileData.pointsToNextRank} points to reach {profileData.nextRank} rank
                </Text>
                <ProgressBar
                  progress={(profileData.totalPoints - profileData.pointsToNextRank) / profileData.totalPoints}
                  color="#FF9800"
                  style={styles.nextRankProgress}
                />
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Certificates */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Your Certificates</Title>
            
            {certificates.length > 0 ? (
              certificates.map((certificate) => (
                <TouchableOpacity
                  key={certificate.id}
                  style={styles.certificateItem}
                  onPress={() => {
                    // View certificate
                    Alert.alert('Certificate', 'This would open the certificate in a real app.');
                  }}
                >
                  <Icon name="certificate" size={32} color="#FF9800" style={styles.certificateIcon} />
                  <View style={styles.certificateInfo}>
                    <Text style={styles.certificateTitle}>{certificate.title}</Text>
                    <Text style={styles.certificateDate}>Issued on {certificate.issueDate}</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#757575" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="certificate-outline" size={48} color="#BDBDBD" />
                <Text style={styles.emptyStateText}>
                  You haven't earned any certificates yet. Complete courses to earn certificates.
                </Text>
              </View>
            )}
          </Card.Content>
          
          {certificates.length > 0 && (
            <Card.Actions>
              <Button
                onPress={() => {
                  // View all certificates
                  Alert.alert('Certificates', 'This would show all certificates in a real app.');
                }}
              >
                View All
              </Button>
            </Card.Actions>
          )}
        </Card>
        
        {/* Account Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Account Settings</Title>
            
            <List.Item
              title="Edit Profile"
              left={props => <List.Icon {...props} icon="account-edit" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('EditProfile')}
            />
            
            <Divider />
            
            <List.Item
              title="Change Password"
              left={props => <List.Icon {...props} icon="lock-reset" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('ChangePassword')}
            />
            
            <Divider />
            
            <List.Item
              title="Biometric Login"
              left={props => <List.Icon {...props} icon="fingerprint" />}
              right={() => (
                <Switch
                  value={biometricsEnabled}
                  onValueChange={handleBiometricsToggle}
                  disabled={!biometricsAvailable}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Dark Mode"
              left={props => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={darkModeEnabled}
                  onValueChange={handleDarkModeToggle}
                />
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Notifications"
              left={props => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationsToggle}
                />
              )}
            />
          </Card.Content>
        </Card>
        
        {/* App Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>App Information</Title>
            
            <List.Item
              title="About"
              description="Learn more about the app"
              left={props => <List.Icon {...props} icon="information" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('About')}
            />
            
            <Divider />
            
            <List.Item
              title="Help & Support"
              description="Get help with the app"
              left={props => <List.Icon {...props} icon="help-circle" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('Support')}
            />
            
            <Divider />
            
            <List.Item
              title="Privacy Policy"
              description="Read our privacy policy"
              left={props => <List.Icon {...props} icon="shield-account" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />
            
            <Divider />
            
            <List.Item
              title="Terms of Service"
              description="Read our terms of service"
              left={props => <List.Icon {...props} icon="file-document" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('TermsOfService')}
            />
          </Card.Content>
        </Card>
        
        {/* Logout Button */}
        <Button
          mode="outlined"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
        
        {/* Version Info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
        
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
        
        <View style={styles.bottomPadding} />
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    backgroundColor: '#E0E0E0',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1976d2',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 24,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  rankChip: {
    alignSelf: 'flex-start',
  },
  card: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  nextRankContainer: {
    marginTop: 8,
  },
  nextRankText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  nextRankProgress: {
    height: 4,
    borderRadius: 2,
  },
  certificateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  certificateIcon: {
    marginRight: 16,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  certificateDate: {
    fontSize: 12,
    color: '#757575',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#757575',
  },
  logoutButton: {
    margin: 16,
    marginTop: 24,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#757575',
    marginTop: 8,
  },
  errorCard: {
    margin: 16,
    marginTop: 8,
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
  bottomPadding: {
    height: 32,
  },
});

export default ProfileScreen;
