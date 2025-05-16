import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
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
  Chip,
  List,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import { fetchCourseDetails } from '../../services/api/courseService';

const { width } = Dimensions.get('window');

const CourseDetailScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const { theme } = useTheme();
  const { isOnline, offlineData, downloadContent, removeOfflineContent } = useOffline();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  
  // Fetch course details
  const loadCourseDetails = async () => {
    try {
      setError(null);
      
      if (isOnline) {
        const data = await fetchCourseDetails(courseId);
        setCourse(data);
        
        // Check if course is downloaded
        const isDownloaded = offlineData.courses?.some(c => c.id === courseId);
        setIsDownloaded(isDownloaded);
      } else {
        // Use offline data
        const offlineCourse = offlineData.courses?.find(c => c.id === courseId);
        
        if (offlineCourse) {
          setCourse(offlineCourse);
          setIsDownloaded(true);
        } else {
          setError('This course is not available offline. Please connect to the internet or download the course for offline use.');
        }
      }
    } catch (err) {
      console.error('Error loading course details:', err);
      setError('Failed to load course details. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Load data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadCourseDetails();
    }, [courseId, isOnline])
  );
  
  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadCourseDetails();
  };
  
  // Toggle module expansion
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  
  // Handle download course
  const handleDownload = async () => {
    try {
      const result = await downloadContent('course', courseId);
      
      if (result.success) {
        setIsDownloaded(true);
      } else {
        setError(result.message || 'Failed to download course');
      }
    } catch (err) {
      console.error('Error downloading course:', err);
      setError('Failed to download course. Please try again.');
    }
  };
  
  // Handle remove downloaded course
  const handleRemoveDownload = async () => {
    try {
      const result = await removeOfflineContent('course', courseId);
      
      if (result.success) {
        setIsDownloaded(false);
      } else {
        setError(result.message || 'Failed to remove downloaded course');
      }
    } catch (err) {
      console.error('Error removing downloaded course:', err);
      setError('Failed to remove downloaded course. Please try again.');
    }
  };
  
  // Render loading state
  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading course details...</Text>
      </View>
    );
  }
  
  // Render error state
  if (!course && error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Course Details" />
        </Appbar.Header>
        
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color="#f44336" />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.goBack()}
            style={{ marginTop: 16 }}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }
  
  // Calculate progress
  const progress = course?.progress || 0;
  const isCompleted = progress === 1;
  const isInProgress = progress > 0 && progress < 1;
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Course Details" />
        {isOnline ? (
          isDownloaded ? (
            <Appbar.Action 
              icon="check-circle" 
              color="#4CAF50" 
              onPress={handleRemoveDownload}
            />
          ) : (
            <Appbar.Action 
              icon="download" 
              onPress={handleDownload}
            />
          )
        ) : (
          <Chip 
            icon="wifi-off" 
            style={styles.offlineChip}
            textStyle={{ color: '#fff', fontSize: 10 }}
          >
            Offline
          </Chip>
        )}
      </Appbar.Header>
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Course Header */}
        <Image 
          source={{ uri: course?.image }} 
          style={styles.courseImage}
          resizeMode="cover"
        />
        
        <View style={styles.courseHeader}>
          <Title style={styles.courseTitle}>{course?.title}</Title>
          
          <View style={styles.tagsContainer}>
            {course?.tags.map((tag, index) => (
              <Chip 
                key={index} 
                style={styles.tag}
                textStyle={styles.tagText}
              >
                {tag}
              </Chip>
            ))}
          </View>
          
          <View style={styles.courseMetaContainer}>
            <View style={styles.courseMeta}>
              <Icon name="clock-outline" size={16} color="#757575" />
              <Text style={styles.courseMetaText}>{course?.duration}</Text>
            </View>
            
            <View style={styles.courseMeta}>
              <Icon name="school" size={16} color="#757575" />
              <Text style={styles.courseMetaText}>{course?.level}</Text>
            </View>
            
            <View style={styles.courseMeta}>
              <Icon name="book-open-variant" size={16} color="#757575" />
              <Text style={styles.courseMetaText}>{course?.lessons} lessons</Text>
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
          
          <Button 
            mode="contained"
            style={styles.enrollButton}
            onPress={() => {
              // Navigate to first lesson or continue where left off
              if (course?.modules?.length > 0 && course.modules[0].lessons.length > 0) {
                navigation.navigate('Lesson', { 
                  lessonId: isInProgress ? course.currentLessonId : course.modules[0].lessons[0].id,
                  courseId: course.id
                });
              }
            }}
          >
            {isCompleted ? 'Review Course' : isInProgress ? 'Continue Learning' : 'Start Course'}
          </Button>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Course Description */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>About this Course</Title>
            <Paragraph style={styles.description}>
              {course?.description}
            </Paragraph>
          </Card.Content>
        </Card>
        
        {/* Course Modules */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Course Content</Title>
            <Text style={styles.moduleCount}>
              {course?.modules?.length || 0} modules • {course?.lessons} lessons • {course?.duration}
            </Text>
            
            {course?.modules?.map((module, index) => (
              <View key={module.id} style={styles.moduleContainer}>
                <TouchableOpacity
                  style={styles.moduleHeader}
                  onPress={() => toggleModule(module.id)}
                >
                  <View style={styles.moduleHeaderLeft}>
                    <Text style={styles.moduleNumber}>Module {index + 1}</Text>
                    <Text style={styles.moduleTitle}>{module.title}</Text>
                  </View>
                  
                  <View style={styles.moduleHeaderRight}>
                    <Text style={styles.lessonCount}>{module.lessons.length} lessons</Text>
                    <Icon 
                      name={expandedModules[module.id] ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color="#757575" 
                    />
                  </View>
                </TouchableOpacity>
                
                {expandedModules[module.id] && (
                  <View style={styles.lessonList}>
                    {module.lessons.map((lesson, lessonIndex) => (
                      <TouchableOpacity
                        key={lesson.id}
                        style={[
                          styles.lessonItem,
                          lesson.completed && styles.completedLesson,
                          lesson.id === course.currentLessonId && styles.currentLesson,
                        ]}
                        onPress={() => navigation.navigate('Lesson', { 
                          lessonId: lesson.id,
                          courseId: course.id
                        })}
                      >
                        <View style={styles.lessonItemLeft}>
                          {lesson.completed ? (
                            <Icon name="check-circle" size={24} color="#4CAF50" />
                          ) : lesson.id === course.currentLessonId ? (
                            <Icon name="play-circle" size={24} color={theme.colors.primary} />
                          ) : (
                            <Text style={styles.lessonNumber}>{lessonIndex + 1}</Text>
                          )}
                          <View style={styles.lessonInfo}>
                            <Text style={styles.lessonTitle}>{lesson.title}</Text>
                            <View style={styles.lessonMeta}>
                              <Icon name="clock-outline" size={14} color="#757575" />
                              <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                              
                              {lesson.hasQuiz && (
                                <>
                                  <Icon name="help-circle" size={14} color="#757575" style={{ marginLeft: 8 }} />
                                  <Text style={styles.lessonDuration}>Quiz</Text>
                                </>
                              )}
                            </View>
                          </View>
                        </View>
                        
                        <Icon name="chevron-right" size={24} color="#757575" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                {index < course.modules.length - 1 && <Divider style={styles.moduleDivider} />}
              </View>
            ))}
          </Card.Content>
        </Card>
        
        {/* Prerequisites */}
        {course?.prerequisites?.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Prerequisites</Title>
              <View style={styles.prerequisitesList}>
                {course.prerequisites.map((prerequisite, index) => (
                  <View key={index} style={styles.prerequisiteItem}>
                    <Icon name="check-circle" size={16} color={theme.colors.primary} />
                    <Text style={styles.prerequisiteText}>{prerequisite}</Text>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}
        
        {/* Instructor */}
        {course?.instructor && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Instructor</Title>
              <View style={styles.instructorContainer}>
                <Image 
                  source={{ uri: course.instructor.avatar }} 
                  style={styles.instructorAvatar}
                />
                <View style={styles.instructorInfo}>
                  <Text style={styles.instructorName}>{course.instructor.name}</Text>
                  <Text style={styles.instructorTitle}>{course.instructor.title}</Text>
                  <Paragraph style={styles.instructorBio} numberOfLines={3}>
                    {course.instructor.bio}
                  </Paragraph>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
        
        {/* Error Message */}
        {error && (
          <Card style={styles.errorCard}>
            <Card.Content>
              <View style={styles.errorContent}>
                <Icon name="alert-circle" size={24} color="#f44336" />
                <Text style={styles.errorMessage}>{error}</Text>
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
  courseImage: {
    width: '100%',
    height: 200,
  },
  courseHeader: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E0E0E0',
  },
  tagText: {
    fontSize: 12,
  },
  courseMetaContainer: {
    flexDirection: 'row',
    marginTop: 8,
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
  enrollButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 8,
  },
  card: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    lineHeight: 22,
  },
  moduleCount: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  moduleContainer: {
    marginBottom: 8,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  moduleHeaderLeft: {
    flex: 1,
  },
  moduleNumber: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  moduleHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonCount: {
    fontSize: 12,
    color: '#757575',
    marginRight: 8,
  },
  lessonList: {
    marginLeft: 16,
    marginBottom: 8,
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  completedLesson: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  currentLesson: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  },
  lessonItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
  },
  lessonInfo: {
    marginLeft: 12,
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonDuration: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  moduleDivider: {
    marginVertical: 8,
  },
  prerequisitesList: {
    marginTop: 8,
  },
  prerequisiteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  prerequisiteText: {
    marginLeft: 8,
  },
  instructorContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  instructorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  instructorInfo: {
    marginLeft: 16,
    flex: 1,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructorTitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  instructorBio: {
    fontSize: 14,
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
  errorMessage: {
    color: '#f44336',
    marginLeft: 8,
    flex: 1,
  },
  bottomPadding: {
    height: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#f44336',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  offlineChip: {
    backgroundColor: '#FF9800',
    height: 24,
    marginRight: 16,
  },
});

export default CourseDetailScreen;
