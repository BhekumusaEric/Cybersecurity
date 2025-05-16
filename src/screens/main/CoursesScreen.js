/**
 * Courses Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock data
const coursesData = [
  {
    id: '1',
    title: 'Introduction to Ethical Hacking',
    description: 'Learn the basics of ethical hacking and penetration testing',
    image: 'https://via.placeholder.com/150',
    level: 'Beginner',
    duration: '8 weeks',
    progress: 75,
  },
  {
    id: '2',
    title: 'Network Security Fundamentals',
    description: 'Master the fundamentals of network security and protection',
    image: 'https://via.placeholder.com/150',
    level: 'Intermediate',
    duration: '10 weeks',
    progress: 30,
  },
  {
    id: '3',
    title: 'Web Application Security',
    description: 'Learn how to secure web applications from common vulnerabilities',
    image: 'https://via.placeholder.com/150',
    level: 'Intermediate',
    duration: '12 weeks',
    progress: 10,
  },
  {
    id: '4',
    title: 'Advanced Penetration Testing',
    description: 'Advanced techniques for penetration testing and vulnerability assessment',
    image: 'https://via.placeholder.com/150',
    level: 'Advanced',
    duration: '14 weeks',
    progress: 0,
  },
  {
    id: '5',
    title: 'Mobile Security',
    description: 'Learn how to secure mobile applications and devices',
    image: 'https://via.placeholder.com/150',
    level: 'Intermediate',
    duration: '8 weeks',
    progress: 0,
  },
  {
    id: '6',
    title: 'Cryptography',
    description: 'Understand cryptographic algorithms and their applications in security',
    image: 'https://via.placeholder.com/150',
    level: 'Advanced',
    duration: '10 weeks',
    progress: 0,
  },
];

const CoursesScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'inProgress', 'completed', 'notStarted'

  // Filter courses based on search query and filter
  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'inProgress') return matchesSearch && course.progress > 0 && course.progress < 100;
    if (filter === 'completed') return matchesSearch && course.progress === 100;
    if (filter === 'notStarted') return matchesSearch && course.progress === 0;
    
    return matchesSearch;
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 40,
      color: colors.text,
    },
    filterContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
    },
    filterButtonText: {
      fontWeight: '500',
    },
    courseCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    courseImage: {
      width: '100%',
      height: 150,
      resizeMode: 'cover',
    },
    courseContent: {
      padding: 16,
    },
    courseTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    courseDescription: {
      fontSize: 14,
      color: colors.text + '99',
      marginBottom: 12,
    },
    courseMetaContainer: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    courseMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    courseMetaText: {
      fontSize: 12,
      color: colors.text + '99',
      marginLeft: 4,
    },
    progressContainer: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginBottom: 8,
    },
    progressBar: {
      height: '100%',
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    progressText: {
      fontSize: 12,
      color: colors.text + '99',
      textAlign: 'right',
    },
    courseActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 12,
    },
    courseButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    courseButtonText: {
      color: '#FFFFFF',
      fontWeight: '500',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: colors.text + '99',
      textAlign: 'center',
      marginTop: 16,
    },
  });

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.courseImage} />
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseDescription}>{item.description}</Text>
        
        <View style={styles.courseMetaContainer}>
          <View style={styles.courseMeta}>
            <Icon name="school" size={16} color={colors.text + '99'} />
            <Text style={styles.courseMetaText}>{item.level}</Text>
          </View>
          <View style={styles.courseMeta}>
            <Icon name="clock-outline" size={16} color={colors.text + '99'} />
            <Text style={styles.courseMetaText}>{item.duration}</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{item.progress}% complete</Text>
        
        <View style={styles.courseActions}>
          <TouchableOpacity
            style={styles.courseButton}
            onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
          >
            <Text style={styles.courseButtonText}>
              {item.progress > 0 ? 'Continue' : 'Start Course'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="book-search" size={64} color={colors.text + '50'} />
      <Text style={styles.emptyText}>No courses found matching your criteria</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.text + '99'} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          placeholderTextColor={colors.text + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === 'all' ? colors.primary + '20' : 'transparent',
              borderColor: filter === 'all' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filter === 'all' ? colors.primary : colors.text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === 'inProgress' ? colors.primary + '20' : 'transparent',
              borderColor: filter === 'inProgress' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setFilter('inProgress')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filter === 'inProgress' ? colors.primary : colors.text },
            ]}
          >
            In Progress
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === 'completed' ? colors.primary + '20' : 'transparent',
              borderColor: filter === 'completed' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filter === 'completed' ? colors.primary : colors.text },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

export default CoursesScreen;
