/**
 * Course Detail Screen
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock data
const courseData = {
  id: '1',
  title: 'Introduction to Ethical Hacking',
  description: 'Learn the basics of ethical hacking and penetration testing. This course covers the fundamental concepts, tools, and techniques used by ethical hackers to identify and address security vulnerabilities.',
  image: 'https://via.placeholder.com/400',
  level: 'Beginner',
  duration: '8 weeks',
  instructor: 'John Doe',
  rating: 4.8,
  reviews: 124,
  students: 1250,
  progress: 75,
  lastUpdated: '2023-08-15',
  modules: [
    {
      id: '1',
      title: 'Introduction to Ethical Hacking',
      description: 'Learn the basics of ethical hacking and its importance',
      lessons: [
        {
          id: '1',
          title: 'What is Ethical Hacking?',
          duration: '15 min',
          completed: true,
        },
        {
          id: '2',
          title: 'Legal and Ethical Considerations',
          duration: '20 min',
          completed: true,
        },
        {
          id: '3',
          title: 'Types of Hackers',
          duration: '18 min',
          completed: true,
        },
      ],
    },
    {
      id: '2',
      title: 'Reconnaissance and Footprinting',
      description: 'Learn how to gather information about targets',
      lessons: [
        {
          id: '4',
          title: 'Passive Reconnaissance',
          duration: '25 min',
          completed: true,
        },
        {
          id: '5',
          title: 'Active Reconnaissance',
          duration: '30 min',
          completed: false,
        },
        {
          id: '6',
          title: 'Tools for Reconnaissance',
          duration: '35 min',
          completed: false,
        },
      ],
    },
    {
      id: '3',
      title: 'Scanning Networks',
      description: 'Learn how to scan networks for vulnerabilities',
      lessons: [
        {
          id: '7',
          title: 'Network Scanning Basics',
          duration: '20 min',
          completed: false,
        },
        {
          id: '8',
          title: 'Port Scanning Techniques',
          duration: '25 min',
          completed: false,
        },
        {
          id: '9',
          title: 'Vulnerability Scanning',
          duration: '30 min',
          completed: false,
        },
      ],
    },
  ],
};

const CourseDetailScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const { colors } = useTheme();
  const { isContentAvailableOffline, downloadContent, removeOfflineContent, isOnline } = useOffline();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAvailableOffline, setIsAvailableOffline] = useState(false);
  
  useEffect(() => {
    // Simulate API call to fetch course details
    const fetchCourse = async () => {
      try {
        // In a real app, you would fetch the course data from an API
        // For now, we'll use the mock data
        setTimeout(() => {
          setCourse(courseData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching course:', error);
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);
  
  useEffect(() => {
    if (course) {
      // Check if course is available offline
      const checkOfflineAvailability = async () => {
        const available = await isContentAvailableOffline('course', course.id);
        setIsAvailableOffline(available);
      };
      
      checkOfflineAvailability();
    }
  }, [course, isContentAvailableOffline]);
  
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };
  
  const handleDownload = async () => {
    if (!isOnline) {
      alert('You are offline. Cannot download content.');
      return;
    }
    
    setIsDownloading(true);
    try {
      const result = await downloadContent('course', course.id, true);
      if (result.success) {
        setIsAvailableOffline(true);
        alert('Course downloaded for offline use');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error downloading course:', error);
      alert('Failed to download course');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleRemoveOffline = async () => {
    try {
      const result = await removeOfflineContent('course', course.id, true);
      if (result.success) {
        setIsAvailableOffline(false);
        alert('Course removed from offline content');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error removing course from offline content:', error);
      alert('Failed to remove course from offline content');
    }
  };
  
  const calculateProgress = () => {
    if (!course) return 0;
    
    let completedLessons = 0;
    let totalLessons = 0;
    
    course.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        totalLessons++;
        if (lesson.completed) {
          completedLessons++;
        }
      });
    });
    
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    image: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: colors.text + '99',
      marginBottom: 16,
      lineHeight: 24,
    },
    metaContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
      marginBottom: 8,
    },
    metaText: {
      fontSize: 14,
      color: colors.text + '99',
      marginLeft: 4,
    },
    progressContainer: {
      marginBottom: 24,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    progressValue: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: 'bold',
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    moduleCard: {
      backgroundColor: colors.card,
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    moduleHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    moduleTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
    },
    moduleContent: {
      padding: 16,
      paddingTop: 0,
    },
    moduleDescription: {
      fontSize: 14,
      color: colors.text + '99',
      marginBottom: 16,
    },
    lessonItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lessonStatus: {
      marginRight: 12,
    },
    lessonInfo: {
      flex: 1,
    },
    lessonTitle: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 4,
    },
    lessonDuration: {
      fontSize: 12,
      color: colors.text + '80',
    },
    actionButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 16,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    offlineButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.primary,
      marginBottom: 24,
    },
    offlineButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16, color: colors.text }}>Loading course...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="alert-circle" size={64} color={colors.error} />
        <Text style={{ marginTop: 16, color: colors.text }}>Failed to load course</Text>
        <TouchableOpacity
          style={[styles.actionButton, { marginTop: 24 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.actionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progress = calculateProgress();

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: course.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.description}>{course.description}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Icon name="school" size={16} color={colors.text + '99'} />
            <Text style={styles.metaText}>{course.level}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="clock-outline" size={16} color={colors.text + '99'} />
            <Text style={styles.metaText}>{course.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="account" size={16} color={colors.text + '99'} />
            <Text style={styles.metaText}>{course.instructor}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="star" size={16} color={colors.warning} />
            <Text style={styles.metaText}>{course.rating} ({course.reviews} reviews)</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="account-group" size={16} color={colors.text + '99'} />
            <Text style={styles.metaText}>{course.students} students</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="calendar" size={16} color={colors.text + '99'} />
            <Text style={styles.metaText}>Updated {course.lastUpdated}</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressValue}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Navigate to the next uncompleted lesson
            let nextLessonId = null;
            let nextLessonFound = false;
            
            for (const module of course.modules) {
              if (nextLessonFound) break;
              
              for (const lesson of module.lessons) {
                if (!lesson.completed) {
                  nextLessonId = lesson.id;
                  nextLessonFound = true;
                  break;
                }
              }
            }
            
            if (nextLessonId) {
              navigation.navigate('Lesson', { lessonId: nextLessonId });
            } else {
              // All lessons completed
              alert('You have completed all lessons in this course!');
            }
          }}
        >
          <Text style={styles.actionButtonText}>
            {progress > 0 ? 'Continue Learning' : 'Start Learning'}
          </Text>
        </TouchableOpacity>
        
        {isDownloading ? (
          <View style={styles.offlineButton}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.offlineButtonText}>Downloading...</Text>
          </View>
        ) : isAvailableOffline ? (
          <TouchableOpacity style={styles.offlineButton} onPress={handleRemoveOffline}>
            <Icon name="delete" size={18} color={colors.primary} />
            <Text style={styles.offlineButtonText}>Remove from Offline</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.offlineButton} onPress={handleDownload}>
            <Icon name="download" size={18} color={colors.primary} />
            <Text style={styles.offlineButtonText}>Download for Offline</Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.sectionTitle}>Course Content</Text>
        
        {course.modules.map((module) => (
          <View key={module.id} style={styles.moduleCard}>
            <TouchableOpacity
              style={styles.moduleHeader}
              onPress={() => toggleModule(module.id)}
            >
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Icon
                name={expandedModules[module.id] ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
            
            {expandedModules[module.id] && (
              <View style={styles.moduleContent}>
                <Text style={styles.moduleDescription}>{module.description}</Text>
                
                {module.lessons.map((lesson) => (
                  <TouchableOpacity
                    key={lesson.id}
                    style={styles.lessonItem}
                    onPress={() => navigation.navigate('Lesson', { lessonId: lesson.id })}
                  >
                    <View style={styles.lessonStatus}>
                      {lesson.completed ? (
                        <Icon name="check-circle" size={20} color={colors.success} />
                      ) : (
                        <Icon name="circle-outline" size={20} color={colors.text + '50'} />
                      )}
                    </View>
                    <View style={styles.lessonInfo}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                    </View>
                    <Icon name="chevron-right" size={20} color={colors.text + '50'} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CourseDetailScreen;
