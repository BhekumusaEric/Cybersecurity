import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Chip,
  Searchbar,
  Appbar,
  ActivityIndicator,
  Button,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import { fetchCourses } from '../../services/api/courseService';

const CoursesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { isOnline, offlineData } = useOffline();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'in-progress', 'completed'

  // Fetch courses
  const loadCourses = async () => {
    try {
      setError(null);

      if (isOnline) {
        const data = await fetchCourses();
        setCourses(data);
        filterCourses(data, searchQuery, activeFilter);
      } else {
        // Use offline data
        setCourses(offlineData.courses || []);
        filterCourses(offlineData.courses || [], searchQuery, activeFilter);
      }
    } catch (err) {
      console.error('Error loading courses:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadCourses();
    }, [isOnline])
  );

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadCourses();
  };

  // Filter courses based on search query and active filter
  const filterCourses = (coursesData, query, filter) => {
    let filtered = coursesData;

    // Apply search filter
    if (query) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Apply status filter
    if (filter === 'in-progress') {
      filtered = filtered.filter(course =>
        course.progress && course.progress > 0 && course.progress < 1
      );
    } else if (filter === 'completed') {
      filtered = filtered.filter(course =>
        course.progress && course.progress === 1
      );
    }

    setFilteredCourses(filtered);
  };

  // Handle search
  const onChangeSearch = query => {
    setSearchQuery(query);
    filterCourses(courses, query, activeFilter);
  };

  // Handle filter change
  const onFilterChange = filter => {
    setActiveFilter(filter);
    filterCourses(courses, searchQuery, filter);
  };

  // Render course item
  const renderCourseItem = ({ item }) => {
    const progress = item.progress || 0;
    const isCompleted = progress === 1;
    const isInProgress = progress > 0 && progress < 1;

    return (
      <Card
        style={styles.courseCard}
        onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
      >
        <Card.Cover source={{ uri: item.image }} style={styles.courseImage} />

        <Card.Content>
          <Title style={styles.courseTitle}>{item.title}</Title>

          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <Chip
                key={index}
                style={styles.tag}
                textStyle={styles.tagText}
              >
                {tag}
              </Chip>
            ))}
          </View>

          <Paragraph style={styles.courseDescription} numberOfLines={2}>
            {item.description}
          </Paragraph>

          <View style={styles.courseMetaContainer}>
            <View style={styles.courseMeta}>
              <Icon name="clock-outline" size={16} color="#757575" />
              <Text style={styles.courseMetaText}>{item.duration}</Text>
            </View>

            <View style={styles.courseMeta}>
              <Icon name="school" size={16} color="#757575" />
              <Text style={styles.courseMetaText}>{item.level}</Text>
            </View>

            <View style={styles.courseMeta}>
              <Icon name="book-open-variant" size={16} color="#757575" />
              <Text style={styles.courseMetaText}>{item.lessons} lessons</Text>
            </View>
          </View>

          {(isInProgress || isCompleted) && (
            <View style={styles.progressContainer}>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressText}>
                  {isCompleted ? 'Completed' : 'In Progress'}
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>
              <ProgressBar
                progress={progress}
                color={isCompleted ? '#4CAF50' : theme.colors.primary}
                style={styles.progressBar}
              />
            </View>
          )}
        </Card.Content>

        <Card.Actions>
          <Button
            mode={isInProgress ? "contained" : "outlined"}
            onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
          >
            {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
          </Button>

          {!isOnline && (
            <Button
              icon={item.isDownloaded ? "check" : "download"}
              mode="text"
              onPress={() => {/* Handle download */}}
              disabled={item.isDownloaded}
            >
              {item.isDownloaded ? 'Downloaded' : 'Download'}
            </Button>
          )}
        </Card.Actions>
      </Card>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="book-open-variant" size={64} color="#BDBDBD" />
      <Text style={styles.emptyStateTitle}>No courses found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery
          ? 'Try a different search term or filter'
          : activeFilter !== 'all'
            ? 'No courses match the selected filter'
            : 'Courses will appear here once available'}
      </Text>

      {(searchQuery || activeFilter !== 'all') && (
        <Button
          mode="contained"
          onPress={() => {
            setSearchQuery('');
            setActiveFilter('all');
            filterCourses(courses, '', 'all');
          }}
          style={styles.resetButton}
        >
          Reset Filters
        </Button>
      )}
    </View>
  );

  // Render loading state
  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Courses" />
        {!isOnline && (
          <Chip
            icon="wifi-off"
            style={styles.offlineChip}
            textStyle={{ color: '#fff', fontSize: 10 }}
          >
            Offline
          </Chip>
        )}
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search courses"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'all' && styles.activeFilterButton,
            ]}
            onPress={() => onFilterChange('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === 'all' && styles.activeFilterButtonText,
              ]}
            >
              All Courses
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'in-progress' && styles.activeFilterButton,
            ]}
            onPress={() => onFilterChange('in-progress')}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === 'in-progress' && styles.activeFilterButtonText,
              ]}
            >
              In Progress
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'completed' && styles.activeFilterButton,
            ]}
            onPress={() => onFilterChange('completed')}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === 'completed' && styles.activeFilterButtonText,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={24} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />
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
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    elevation: 2,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeFilterButton: {
    backgroundColor: '#1976d2',
  },
  filterButtonText: {
    color: '#757575',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  courseCard: {
    marginBottom: 16,
    elevation: 2,
  },
  courseImage: {
    height: 150,
  },
  courseTitle: {
    fontSize: 18,
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E0E0E0',
  },
  tagText: {
    fontSize: 12,
  },
  courseDescription: {
    marginBottom: 8,
  },
  courseMetaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  courseMetaText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#757575',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#757575',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#757575',
    marginBottom: 16,
  },
  resetButton: {
    marginTop: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#f44336',
    marginLeft: 8,
    flex: 1,
  },
  offlineChip: {
    backgroundColor: '#FF9800',
    height: 24,
    marginRight: 16,
  },
});

export default CoursesScreen;
