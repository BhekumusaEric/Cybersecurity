/**
 * Profile Screen
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock data
const achievements = [
  {
    id: '1',
    title: 'First Course Completed',
    description: 'Completed your first course',
    icon: 'trophy',
    date: '2023-05-15',
  },
  {
    id: '2',
    title: 'Lab Master',
    description: 'Completed 10 labs',
    icon: 'flask',
    date: '2023-06-20',
  },
  {
    id: '3',
    title: 'Perfect Score',
    description: 'Achieved 100% on an assessment',
    icon: 'check-circle',
    date: '2023-07-10',
  },
];

const certificates = [
  {
    id: '1',
    title: 'Introduction to Ethical Hacking',
    issueDate: '2023-05-20',
    expiryDate: '2026-05-20',
  },
  {
    id: '2',
    title: 'Network Security Fundamentals',
    issueDate: '2023-07-15',
    expiryDate: '2026-07-15',
  },
];

const ProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      paddingTop: 30,
      paddingBottom: 20,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 40,
      fontWeight: 'bold',
      color: colors.primary,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    email: {
      fontSize: 16,
      color: '#FFFFFF' + 'DD',
      marginBottom: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colors.card,
      paddingVertical: 16,
      borderRadius: 8,
      marginHorizontal: 20,
      marginTop: -20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.text + '99',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 24,
      marginBottom: 16,
      marginHorizontal: 20,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginHorizontal: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    achievementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    achievementIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    achievementContent: {
      flex: 1,
    },
    achievementTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    achievementDescription: {
      fontSize: 14,
      color: colors.text + '99',
    },
    achievementDate: {
      fontSize: 12,
      color: colors.text + '80',
      marginTop: 4,
    },
    certificateItem: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    certificateTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    certificateDates: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    certificateDate: {
      fontSize: 12,
      color: colors.text + '99',
    },
    certificateActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 12,
    },
    certificateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginLeft: 8,
    },
    certificateButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      marginLeft: 4,
    },
    logoutButton: {
      backgroundColor: colors.error + '20',
      borderRadius: 8,
      padding: 16,
      marginHorizontal: 20,
      marginTop: 16,
      marginBottom: 32,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    logoutButtonText: {
      color: colors.error,
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Labs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Certificates</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>85%</Text>
          <Text style={styles.statLabel}>Avg. Score</Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Achievements</Text>
      <View style={styles.card}>
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <Icon name={achievement.icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
              <Text style={styles.achievementDate}>Earned on {achievement.date}</Text>
            </View>
          </View>
        ))}
      </View>
      
      <Text style={styles.sectionTitle}>Certificates</Text>
      <View style={{ marginHorizontal: 20 }}>
        {certificates.map((certificate) => (
          <View key={certificate.id} style={styles.certificateItem}>
            <Text style={styles.certificateTitle}>{certificate.title}</Text>
            <View style={styles.certificateDates}>
              <Text style={styles.certificateDate}>Issued: {certificate.issueDate}</Text>
              <Text style={styles.certificateDate}>Expires: {certificate.expiryDate}</Text>
            </View>
            <View style={styles.certificateActions}>
              <TouchableOpacity style={styles.certificateButton}>
                <Icon name="download" size={14} color="#FFFFFF" />
                <Text style={styles.certificateButtonText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.certificateButton}>
                <Icon name="share-variant" size={14} color="#FFFFFF" />
                <Text style={styles.certificateButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color={colors.error} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
