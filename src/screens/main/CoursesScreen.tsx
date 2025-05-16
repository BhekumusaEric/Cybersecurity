import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../../context/ThemeContext';
import { MainStackParamList } from '../../navigation/types';

type CoursesScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Courses'>;

// Mock data for courses
const coursesData = [
  {
    id: '1',
    title: 'Network Fundamentals',
    description: 'Learn the basics of networking and protocols',
    category: 'Network Security',
    difficulty: 'Beginner',
    duration: '4 weeks',
    progress: 75,
  },
  {
    id: '2',
    title: 'Network Scanning',
    description: 'Master network scanning techniques and tools',
    category: 'Network Security',
    difficulty: 'Intermediate',
    duration: '3 weeks',
    progress: 30,
  },
  {
    id: '3',
    title: 'Advanced Packet Analysis',
    description: 'Deep dive into packet analysis and network traffic',
    category: 'Network Security',
    difficulty: 'Advanced',
    duration: '5 weeks',
    progress: 0,
  },
  {
    id: '4',
    title: 'Web Application Basics',
    description: 'Introduction to web applications and security',
    category: 'Web Security',
    difficulty: 'Beginner',
    duration: '3 weeks',
    progress: 100,
  },
  {
    id: '5',
    title: 'OWASP Top 10',
    description: 'Learn about the most critical web vulnerabilities',
    category: 'Web Security',
    difficulty: 'Intermediate',
    duration: '6 weeks',
    progress: 45,
  },
  {
    id: '6',
    title: 'Advanced Exploitation',
    description: 'Advanced web exploitation techniques',
    category: 'Web Security',
    difficulty: 'Advanced',
    duration: '8 weeks',
    progress: 0,
  },
  {
    id: '7',
    title: 'Mobile Security Fundamentals',
    description: 'Introduction to mobile application security',
    category: 'Mobile Security',
    difficulty: 'Beginner',
    duration: '4 weeks',
    progress: 0,
  },
  {
    id: '8',
    title: 'Cryptography Basics',
    description: 'Learn the fundamentals of cryptography',
    category: 'Cryptography',
    difficulty: 'Beginner',
    duration: '3 weeks',
    progress: 0,
  },
];

// Filter options
const categories = ['All', 'Network Security', 'Web Security', 'Mobile Security', 'Cryptography'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const progressFilters = ['All', 'In Progress', 'Completed', 'Not Started'];

const CoursesScreen: React.FC = () => {
  const navigation = useNavigation<CoursesScreenNavigationProp>();
  const { colors, isDark } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedProgress, setSelectedProgress] = useState('All');

  // Navigate to course details
  const navigateToCourse = (courseId: string) => {
    navigation.navigate('CourseDetails', { courseId });
  };

  // Filter courses based on search query and filters
  const filteredCourses = coursesData.filter((course) => {
    // Search query filter
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    
    // Difficulty filter
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    
    // Progress filter
    let matchesProgress = true;
    if (selectedProgress === 'In Progress') {
      matchesProgress = course.progress > 0 && course.progress < 100;
    } else if (selectedProgress === 'Completed') {
      matchesProgress = course.progress === 100;
    } else if (selectedProgress === 'Not Started') {
      matchesProgress = course.progress === 0;
    }
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesProgress;
  });

  // Render course item
  const renderCourseItem = ({ item }: { item: typeof coursesData[0] }) => {
    // Determine color based on difficulty
    const getDifficultyColor = () => {
      switch (item.difficulty) {
        case 'Beginner':
          return colors.success;
        case 'Intermediate':
          return colors.warning;
        case 'Advanced':
          return colors.danger;
        default:
          return colors.info;
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.courseItem,
          { backgroundColor: isDark ? colors.darkGray : colors.white },
        ]}
        onPress={() => navigateToCourse(item.id)}
      >
        <View style={styles.courseHeader}>
          <Text
            style={[
              styles.courseTitle,
              { color: isDark ? colors.white : colors.dark },
            ]}
          >
            {item.title}
          </Text>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor() },
            ]}
          >
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
        </View>
        
        <Text
          style={[
            styles.courseDescription,
            { color: isDark ? colors.lightGray : colors.gray },
          ]}
        >
          {item.description}
        </Text>
        
        <View style={styles.courseDetails}>
          <Text
            style={[
              styles.courseCategory,
              { color: isDark ? colors.lightGray : colors.gray },
            ]}
          >
            {item.category} • {item.duration}
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${item.progress}%`,
                    backgroundColor: item.progress === 100 ? colors.success : colors.primary,
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
              {item.progress}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render filter chip
  const renderFilterChip = (
    title: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        {
          backgroundColor: isSelected
            ? colors.primary
            : isDark
            ? colors.darkGray
            : colors.lightGray,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterChipText,
          {
            color: isSelected
              ? colors.white
              : isDark
              ? colors.lightGray
              : colors.gray,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.darker : colors.lighter },
      ]}
    >
      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: isDark ? colors.darkGray : colors.white },
        ]}
      >
        <TextInput
          style={[
            styles.searchInput,
            { color: isDark ? colors.white : colors.dark },
          ]}
          placeholder="Search courses..."
          placeholderTextColor={isDark ? colors.lightGray : colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {/* Category Filters */}
        <Text
          style={[
            styles.filterTitle,
            { color: isDark ? colors.white : colors.dark },
          ]}
        >
          Category
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderFilterChip(
            item,
            selectedCategory === item,
            () => setSelectedCategory(item)
          )}
          style={styles.filterList}
        />

        {/* Difficulty Filters */}
        <Text
          style={[
            styles.filterTitle,
            { color: isDark ? colors.white : colors.dark },
          ]}
        >
          Difficulty
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={difficulties}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderFilterChip(
            item,
            selectedDifficulty === item,
            () => setSelectedDifficulty(item)
          )}
          style={styles.filterList}
        />

        {/* Progress Filters */}
        <Text
          style={[
            styles.filterTitle,
            { color: isDark ? colors.white : colors.dark },
          ]}
        >
          Progress
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={progressFilters}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderFilterChip(
            item,
            selectedProgress === item,
            () => setSelectedProgress(item)
          )}
          style={styles.filterList}
        />
      </View>

      {/* Course List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourseItem}
        contentContainerStyle={styles.courseList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? colors.lightGray : colors.gray },
              ]}
            >
              No courses found matching your filters.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    height: 40,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterList: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  courseList: {
    padding: 16,
    paddingTop: 0,
  },
  courseItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  courseDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseCategory: {
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    width: 50,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginRight: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CoursesScreen;
