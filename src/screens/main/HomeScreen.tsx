import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/common/Button';
import { MainStackParamList } from '../../navigation/types';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

// Mock data for courses
const recentCourses = [
  {
    id: '1',
    title: 'Network Fundamentals',
    progress: 75,
    lastAccessed: '2 days ago',
  },
  {
    id: '2',
    title: 'Web Application Basics',
    progress: 100,
    lastAccessed: '1 week ago',
  },
  {
    id: '3',
    title: 'OWASP Top 10',
    progress: 45,
    lastAccessed: 'Yesterday',
  },
];

// Mock data for upcoming labs
const upcomingLabs = [
  {
    id: '1',
    title: 'Network Scanning Lab',
    date: 'Tomorrow, 10:00 AM',
    duration: '2 hours',
  },
  {
    id: '2',
    title: 'SQL Injection Workshop',
    date: 'May 20, 2:00 PM',
    duration: '3 hours',
  },
];

// Mock data for announcements
const announcements = [
  {
    id: '1',
    title: 'New Course Available',
    message: 'Check out our new course on Mobile Application Security!',
    date: '2 days ago',
  },
  {
    id: '2',
    title: 'System Maintenance',
    message: 'The platform will be down for maintenance on May 25 from 2-4 AM UTC.',
    date: '1 week ago',
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();

  // Navigate to course details
  const navigateToCourse = (courseId: string) => {
    navigation.navigate('CourseDetails', { courseId });
  };

  // Navigate to lab details
  const navigateToLab = (labId: string) => {
    navigation.navigate('LabDetails', { labId });
  };

  // Navigate to all courses
  const navigateToAllCourses = () => {
    navigation.navigate('Courses');
  };

  // Navigate to all labs
  const navigateToAllLabs = () => {
    navigation.navigate('Labs');
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.darker : colors.lighter },
      ]}
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text
          style={[
            styles.welcomeText,
            { color: isDark ? colors.white : colors.dark },
          ]}
        >
          Welcome back, {user?.username || 'Student'}!
        </Text>
        <Text
          style={[
            styles.dateText,
            { color: isDark ? colors.lightGray : colors.gray },
          ]}
        >
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Progress Overview */}
      <View
        style={[
          styles.progressCard,
          {
            backgroundColor: isDark ? colors.darkGray : colors.white,
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: isDark ? colors.white : colors.dark },
          ]}
        >
          Your Progress
        </Text>
        <View style={styles.progressStats}>
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                { color: colors.primary },
              ]}
            >
              3
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: isDark ? colors.lightGray : colors.gray },
              ]}
            >
              Courses in Progress
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                { color: colors.success },
              ]}
            >
              2
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: isDark ? colors.lightGray : colors.gray },
              ]}
            >
              Completed Courses
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                { color: colors.warning },
              ]}
            >
              5
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: isDark ? colors.lightGray : colors.gray },
              ]}
            >
              Upcoming Labs
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Courses */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? colors.white : colors.dark },
            ]}
          >
            Recent Courses
          </Text>
          <TouchableOpacity onPress={navigateToAllCourses}>
            <Text
              style={[styles.viewAllText, { color: colors.primary }]}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {recentCourses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={[
              styles.courseItem,
              {
                backgroundColor: isDark ? colors.darkGray : colors.white,
              },
            ]}
            onPress={() => navigateToCourse(course.id)}
          >
            <View style={styles.courseInfo}>
              <Text
                style={[
                  styles.courseTitle,
                  { color: isDark ? colors.white : colors.dark },
                ]}
              >
                {course.title}
              </Text>
              <Text
                style={[
                  styles.courseLastAccessed,
                  { color: isDark ? colors.lightGray : colors.gray },
                ]}
              >
                Last accessed: {course.lastAccessed}
              </Text>
            </View>
            <View style={styles.courseProgress}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${course.progress}%`,
                      backgroundColor: course.progress === 100 ? colors.success : colors.primary,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.progressText,
                  { color: isDark ? colors.lightGray : colors.gray },
                ]}
              >
                {course.progress}% Complete
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Labs */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? colors.white : colors.dark },
            ]}
          >
            Upcoming Labs
          </Text>
          <TouchableOpacity onPress={navigateToAllLabs}>
            <Text
              style={[styles.viewAllText, { color: colors.primary }]}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {upcomingLabs.map((lab) => (
          <TouchableOpacity
            key={lab.id}
            style={[
              styles.labItem,
              {
                backgroundColor: isDark ? colors.darkGray : colors.white,
              },
            ]}
            onPress={() => navigateToLab(lab.id)}
          >
            <View style={styles.labInfo}>
              <Text
                style={[
                  styles.labTitle,
                  { color: isDark ? colors.white : colors.dark },
                ]}
              >
                {lab.title}
              </Text>
              <Text
                style={[
                  styles.labDetails,
                  { color: isDark ? colors.lightGray : colors.gray },
                ]}
              >
                {lab.date} • {lab.duration}
              </Text>
            </View>
            <Button
              title="Join"
              variant="primary"
              size="small"
              onPress={() => navigateToLab(lab.id)}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Announcements */}
      <View style={styles.sectionContainer}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? colors.white : colors.dark },
          ]}
        >
          Announcements
        </Text>

        {announcements.map((announcement) => (
          <View
            key={announcement.id}
            style={[
              styles.announcementItem,
              {
                backgroundColor: isDark ? colors.darkGray : colors.white,
              },
            ]}
          >
            <View style={styles.announcementHeader}>
              <Text
                style={[
                  styles.announcementTitle,
                  { color: isDark ? colors.white : colors.dark },
                ]}
              >
                {announcement.title}
              </Text>
              <Text
                style={[
                  styles.announcementDate,
                  { color: isDark ? colors.lightGray : colors.gray },
                ]}
              >
                {announcement.date}
              </Text>
            </View>
            <Text
              style={[
                styles.announcementMessage,
                { color: isDark ? colors.lightGray : colors.gray },
              ]}
            >
              {announcement.message}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeSection: {
    padding: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
  },
  progressCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
  },
  courseItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  courseInfo: {
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseLastAccessed: {
    fontSize: 12,
  },
  courseProgress: {},
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  labItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  labInfo: {
    flex: 1,
  },
  labTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  labDetails: {
    fontSize: 12,
  },
  announcementItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  announcementDate: {
    fontSize: 12,
  },
  announcementMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default HomeScreen;
