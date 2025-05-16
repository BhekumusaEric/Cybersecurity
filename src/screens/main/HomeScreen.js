/**
 * Home Screen
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock data
const recentCourses = [
  {
    id: '1',
    title: 'Introduction to Ethical Hacking',
    progress: 75,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    title: 'Network Security Fundamentals',
    progress: 30,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    title: 'Web Application Security',
    progress: 10,
    image: 'https://via.placeholder.com/150',
  },
];

const upcomingLabs = [
  {
    id: '1',
    title: 'Network Scanning Lab',
    date: 'Today, 3:00 PM',
    duration: '2 hours',
  },
  {
    id: '2',
    title: 'SQL Injection Practice',
    date: 'Tomorrow, 10:00 AM',
    duration: '1.5 hours',
  },
];

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold',
    },
    welcomeContainer: {
      marginLeft: 15,
    },
    welcomeText: {
      fontSize: 16,
      color: colors.text,
    },
    nameText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 25,
      marginBottom: 15,
      color: colors.text,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 15,
      marginHorizontal: 5,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
      marginTop: 5,
    },
    statLabel: {
      fontSize: 12,
      color: colors.text,
      marginTop: 5,
      textAlign: 'center',
    },
    courseCard: {
      backgroundColor: colors.card,
      borderRadius: 10,
      marginBottom: 15,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    courseImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
    },
    courseContent: {
      padding: 15,
    },
    courseTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    progressContainer: {
      height: 5,
      backgroundColor: colors.border,
      borderRadius: 3,
      marginTop: 5,
    },
    progressBar: {
      height: '100%',
      borderRadius: 3,
      backgroundColor: colors.primary,
    },
    progressText: {
      fontSize: 12,
      color: colors.text,
      marginTop: 5,
      textAlign: 'right',
    },
    labCard: {
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    labIcon: {
      backgroundColor: colors.primary + '20',
      padding: 10,
      borderRadius: 10,
      marginRight: 15,
    },
    labInfo: {
      flex: 1,
    },
    labTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 5,
    },
    labDetails: {
      fontSize: 12,
      color: colors.text + '80',
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    viewAllText: {
      color: colors.primary,
      marginRight: 5,
      fontWeight: 'bold',
    },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{user?.name || 'User'}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="book-open-variant" size={24} color={colors.primary} />
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>Courses in Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="flask" size={24} color={colors.primary} />
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Labs Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="certificate" size={24} color={colors.primary} />
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Certificates Earned</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Continue Learning</Text>
      {recentCourses.map((course) => (
        <TouchableOpacity
          key={course.id}
          style={styles.courseCard}
          onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
        >
          <Image source={{ uri: course.image }} style={styles.courseImage} />
          <View style={styles.courseContent}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <View style={styles.progressContainer}>
              <View
                style={[styles.progressBar, { width: `${course.progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{course.progress}% complete</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.sectionTitle}>Upcoming Labs</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('Labs')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Icon name="chevron-right" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {upcomingLabs.map((lab) => (
        <TouchableOpacity
          key={lab.id}
          style={styles.labCard}
          onPress={() => navigation.navigate('LabDetail', { labId: lab.id })}
        >
          <View style={styles.labIcon}>
            <Icon name="flask" size={24} color={colors.primary} />
          </View>
          <View style={styles.labInfo}>
            <Text style={styles.labTitle}>{lab.title}</Text>
            <Text style={styles.labDetails}>
              {lab.date} • {lab.duration}
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.text + '50'} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default HomeScreen;
