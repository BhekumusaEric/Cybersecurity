import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  BackHandler,
} from 'react-native';
import {
  Text,
  Appbar,
  ActivityIndicator,
  Button,
  ProgressBar,
  Chip,
  IconButton,
  Portal,
  Modal,
  Divider,
} from 'react-native-paper';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import MarkdownDisplay from 'react-native-markdown-display';

import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import { fetchLessonDetails, markLessonCompleted } from '../../services/api/courseService';

const { width, height } = Dimensions.get('window');

const LessonScreen = ({ route, navigation }) => {
  const { lessonId, courseId } = route.params;
  const { theme } = useTheme();
  const { isOnline, offlineData, updateProgressOffline } = useOffline();
  
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const scrollViewRef = useRef();
  const webViewRef = useRef();
  
  // Handle back button press
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (showQuiz) {
          Alert.alert(
            'Exit Quiz',
            'Are you sure you want to exit the quiz? Your progress will not be saved.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Exit', onPress: () => setShowQuiz(false) }
            ]
          );
          return true;
        }
        return false;
      };
      
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [showQuiz])
  );
  
  // Fetch lesson details
  const loadLessonDetails = async () => {
    try {
      setError(null);
      
      if (isOnline) {
        const data = await fetchLessonDetails(lessonId);
        setLesson(data);
        setProgress(data.progress || 0);
      } else {
        // Use offline data
        const offlineLesson = offlineData.lessons?.find(l => l.id === lessonId);
        
        if (offlineLesson) {
          setLesson(offlineLesson);
          setProgress(offlineLesson.progress || 0);
        } else {
          setError('This lesson is not available offline. Please connect to the internet or download the course for offline use.');
        }
      }
    } catch (err) {
      console.error('Error loading lesson details:', err);
      setError('Failed to load lesson details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load lesson data
  useEffect(() => {
    loadLessonDetails();
  }, [lessonId, isOnline]);
  
  // Update progress when section changes
  useEffect(() => {
    if (lesson && lesson.sections) {
      const newProgress = (currentSection + 1) / lesson.sections.length;
      setProgress(newProgress);
      
      // Update progress in backend or offline storage
      if (isOnline) {
        // This would be a real API call in production
        console.log('Updating progress online:', newProgress);
      } else {
        updateProgressOffline({
          [`lesson_${lessonId}`]: newProgress
        });
      }
    }
  }, [currentSection, lesson]);
  
  // Handle section navigation
  const navigateToSection = (index) => {
    if (index >= 0 && index < lesson.sections.length) {
      setCurrentSection(index);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };
  
  // Handle quiz answer selection
  const handleAnswerSelect = (questionId, answerId) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  // Handle quiz submission
  const handleQuizSubmit = () => {
    // Check if all questions are answered
    const allAnswered = lesson.quiz.questions.every(q => quizAnswers[q.id] !== undefined);
    
    if (!allAnswered) {
      Alert.alert('Incomplete Quiz', 'Please answer all questions before submitting.');
      return;
    }
    
    // Calculate results
    const results = {
      totalQuestions: lesson.quiz.questions.length,
      correctAnswers: 0,
      score: 0,
      answers: []
    };
    
    lesson.quiz.questions.forEach(question => {
      const selectedAnswerId = quizAnswers[question.id];
      const isCorrect = question.correctAnswerId === selectedAnswerId;
      
      if (isCorrect) {
        results.correctAnswers++;
      }
      
      results.answers.push({
        questionId: question.id,
        selectedAnswerId,
        isCorrect
      });
    });
    
    results.score = (results.correctAnswers / results.totalQuestions) * 100;
    
    // Set results and mark as submitted
    setQuizResults(results);
    setQuizSubmitted(true);
    
    // If score is passing, mark lesson as completed
    if (results.score >= lesson.quiz.passingScore) {
      handleLessonComplete();
    }
  };
  
  // Handle lesson completion
  const handleLessonComplete = async () => {
    try {
      if (isOnline) {
        await markLessonCompleted(lessonId);
      } else {
        // Store completion status offline
        updateProgressOffline({
          [`lesson_${lessonId}_completed`]: true
        });
      }
      
      setShowCompletionModal(true);
    } catch (err) {
      console.error('Error marking lesson as completed:', err);
      Alert.alert('Error', 'Failed to mark lesson as completed. Please try again.');
    }
  };
  
  // Navigate to next lesson
  const navigateToNextLesson = () => {
    if (lesson.nextLessonId) {
      navigation.replace('Lesson', {
        lessonId: lesson.nextLessonId,
        courseId
      });
    } else {
      // No next lesson, go back to course
      navigation.navigate('CourseDetail', { courseId });
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading lesson...</Text>
      </View>
    );
  }
  
  // Render error state
  if (!lesson && error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Lesson" />
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
  
  // Render quiz
  if (showQuiz && lesson?.quiz) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => {
            if (!quizSubmitted) {
              Alert.alert(
                'Exit Quiz',
                'Are you sure you want to exit the quiz? Your progress will not be saved.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Exit', onPress: () => setShowQuiz(false) }
                ]
              );
            } else {
              setShowQuiz(false);
            }
          }} />
          <Appbar.Content title={lesson.quiz.title || 'Quiz'} />
        </Appbar.Header>
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.quizContainer}>
          {!quizSubmitted ? (
            <>
              <Text style={styles.quizDescription}>{lesson.quiz.description}</Text>
              
              {lesson.quiz.questions.map((question, index) => (
                <View key={question.id} style={styles.questionContainer}>
                  <Text style={styles.questionNumber}>Question {index + 1} of {lesson.quiz.questions.length}</Text>
                  <Text style={styles.questionText}>{question.text}</Text>
                  
                  {question.answers.map(answer => (
                    <TouchableOpacity
                      key={answer.id}
                      style={[
                        styles.answerOption,
                        quizAnswers[question.id] === answer.id && styles.selectedAnswer
                      ]}
                      onPress={() => handleAnswerSelect(question.id, answer.id)}
                    >
                      <View style={styles.answerCheckbox}>
                        {quizAnswers[question.id] === answer.id ? (
                          <Icon name="checkbox-marked-circle" size={24} color={theme.colors.primary} />
                        ) : (
                          <Icon name="checkbox-blank-circle-outline" size={24} color="#757575" />
                        )}
                      </View>
                      <Text style={styles.answerText}>{answer.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
              
              <Button
                mode="contained"
                onPress={handleQuizSubmit}
                style={styles.submitButton}
              >
                Submit Quiz
              </Button>
            </>
          ) : (
            <View style={styles.resultsContainer}>
              <View style={[
                styles.scoreContainer,
                quizResults.score >= lesson.quiz.passingScore
                  ? styles.passingScore
                  : styles.failingScore
              ]}>
                <Text style={styles.scoreText}>Your Score</Text>
                <Text style={styles.scoreValue}>{Math.round(quizResults.score)}%</Text>
                <Text style={styles.scoreStatus}>
                  {quizResults.score >= lesson.quiz.passingScore
                    ? 'Passed!'
                    : 'Failed - Please try again'}
                </Text>
              </View>
              
              <Text style={styles.resultsTitle}>Quiz Results</Text>
              <Text style={styles.resultsSubtitle}>
                You answered {quizResults.correctAnswers} out of {quizResults.totalQuestions} questions correctly.
              </Text>
              
              {lesson.quiz.questions.map((question, index) => {
                const answer = quizResults.answers.find(a => a.questionId === question.id);
                const selectedAnswer = question.answers.find(a => a.id === answer.selectedAnswerId);
                const correctAnswer = question.answers.find(a => a.id === question.correctAnswerId);
                
                return (
                  <View key={question.id} style={styles.resultQuestionContainer}>
                    <Text style={styles.questionNumber}>Question {index + 1}</Text>
                    <Text style={styles.questionText}>{question.text}</Text>
                    
                    <View style={styles.resultAnswerContainer}>
                      <Text style={styles.yourAnswerLabel}>Your answer:</Text>
                      <View style={[
                        styles.resultAnswer,
                        answer.isCorrect ? styles.correctAnswer : styles.incorrectAnswer
                      ]}>
                        <Icon
                          name={answer.isCorrect ? "check-circle" : "close-circle"}
                          size={20}
                          color={answer.isCorrect ? "#4CAF50" : "#F44336"}
                          style={styles.resultIcon}
                        />
                        <Text style={styles.resultAnswerText}>{selectedAnswer.text}</Text>
                      </View>
                      
                      {!answer.isCorrect && (
                        <>
                          <Text style={styles.correctAnswerLabel}>Correct answer:</Text>
                          <View style={[styles.resultAnswer, styles.correctAnswer]}>
                            <Icon
                              name="check-circle"
                              size={20}
                              color="#4CAF50"
                              style={styles.resultIcon}
                            />
                            <Text style={styles.resultAnswerText}>{correctAnswer.text}</Text>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                );
              })}
              
              {quizResults.score >= lesson.quiz.passingScore ? (
                <Button
                  mode="contained"
                  onPress={() => {
                    setShowQuiz(false);
                    if (lesson.nextLessonId) {
                      Alert.alert(
                        'Continue to Next Lesson',
                        'Would you like to continue to the next lesson?',
                        [
                          { text: 'No', style: 'cancel' },
                          { text: 'Yes', onPress: navigateToNextLesson }
                        ]
                      );
                    }
                  }}
                  style={styles.continueButton}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  mode="contained"
                  onPress={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                    setQuizResults(null);
                  }}
                  style={styles.retryButton}
                >
                  Retry Quiz
                </Button>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
  
  // Render main lesson content
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={lesson?.title || 'Lesson'} />
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
      
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progress}
          color={theme.colors.primary}
          style={styles.progressBar}
        />
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>
            Section {currentSection + 1} of {lesson?.sections?.length || 0}
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round(progress * 100)}% Complete
          </Text>
        </View>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {lesson?.sections && lesson.sections[currentSection] && (
          <>
            <Text style={styles.sectionTitle}>{lesson.sections[currentSection].title}</Text>
            
            {lesson.sections[currentSection].content && (
              <MarkdownDisplay
                markdown={lesson.sections[currentSection].content}
                style={{
                  body: styles.markdownBody,
                  heading1: styles.markdownH1,
                  heading2: styles.markdownH2,
                  heading3: styles.markdownH3,
                  paragraph: styles.markdownParagraph,
                  list: styles.markdownList,
                  listItem: styles.markdownListItem,
                  code_block: styles.markdownCodeBlock,
                  code_inline: styles.markdownCodeInline,
                  blockquote: styles.markdownBlockquote,
                }}
              />
            )}
            
            {lesson.sections[currentSection].videoUrl && (
              <View style={styles.videoContainer}>
                <WebView
                  ref={webViewRef}
                  source={{ uri: lesson.sections[currentSection].videoUrl }}
                  style={styles.video}
                  allowsFullscreenVideo={true}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              </View>
            )}
          </>
        )}
        
        <View style={styles.navigationContainer}>
          <Button
            mode="outlined"
            icon="arrow-left"
            onPress={() => navigateToSection(currentSection - 1)}
            disabled={currentSection === 0}
            style={[styles.navButton, styles.prevButton]}
          >
            Previous
          </Button>
          
          {currentSection < (lesson?.sections?.length - 1) ? (
            <Button
              mode="contained"
              icon="arrow-right"
              contentStyle={{ flexDirection: 'row-reverse' }}
              onPress={() => navigateToSection(currentSection + 1)}
              style={[styles.navButton, styles.nextButton]}
            >
              Next
            </Button>
          ) : (
            <Button
              mode="contained"
              icon="check"
              contentStyle={{ flexDirection: 'row-reverse' }}
              onPress={() => {
                if (lesson.hasQuiz) {
                  setShowQuiz(true);
                } else {
                  handleLessonComplete();
                }
              }}
              style={[styles.navButton, styles.completeButton]}
            >
              {lesson.hasQuiz ? 'Take Quiz' : 'Complete'}
            </Button>
          )}
        </View>
      </ScrollView>
      
      {/* Lesson completion modal */}
      <Portal>
        <Modal
          visible={showCompletionModal}
          onDismiss={() => setShowCompletionModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.completionContainer}>
            <Icon name="check-circle" size={64} color="#4CAF50" />
            <Text style={styles.completionTitle}>Lesson Completed!</Text>
            <Text style={styles.completionText}>
              Congratulations! You have successfully completed this lesson.
            </Text>
            
            <View style={styles.completionButtons}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowCompletionModal(false);
                  navigation.navigate('CourseDetail', { courseId });
                }}
                style={styles.completionButton}
              >
                Back to Course
              </Button>
              
              {lesson.nextLessonId && (
                <Button
                  mode="contained"
                  onPress={() => {
                    setShowCompletionModal(false);
                    navigateToNextLesson();
                  }}
                  style={styles.completionButton}
                >
                  Next Lesson
                </Button>
              )}
            </View>
          </View>
        </Modal>
      </Portal>
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
  progressContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#757575',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#757575',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  prevButton: {
    marginLeft: 0,
  },
  nextButton: {
    marginRight: 0,
  },
  completeButton: {
    marginRight: 0,
    backgroundColor: '#4CAF50',
  },
  videoContainer: {
    width: '100%',
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
  markdownBody: {
    fontSize: 16,
    lineHeight: 24,
  },
  markdownH1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  markdownH2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  markdownH3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  markdownParagraph: {
    marginVertical: 8,
  },
  markdownList: {
    marginVertical: 8,
  },
  markdownListItem: {
    marginVertical: 4,
  },
  markdownCodeBlock: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  markdownCodeInline: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  markdownBlockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#757575',
    paddingLeft: 16,
    marginVertical: 8,
    fontStyle: 'italic',
  },
  quizContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  quizDescription: {
    fontSize: 16,
    marginBottom: 24,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionNumber: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedAnswer: {
    borderColor: '#1976d2',
    backgroundColor: 'rgba(25, 118, 210, 0.05)',
  },
  answerCheckbox: {
    marginRight: 16,
  },
  answerText: {
    fontSize: 16,
    flex: 1,
  },
  submitButton: {
    marginTop: 16,
  },
  resultsContainer: {
    padding: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 8,
    marginBottom: 24,
  },
  passingScore: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  failingScore: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  scoreText: {
    fontSize: 16,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreStatus: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  resultQuestionContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  resultAnswerContainer: {
    marginTop: 8,
  },
  yourAnswerLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  correctAnswerLabel: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
    marginBottom: 4,
  },
  resultAnswer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  correctAnswer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  incorrectAnswer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  resultIcon: {
    marginRight: 12,
  },
  resultAnswerText: {
    fontSize: 16,
  },
  continueButton: {
    marginTop: 24,
  },
  retryButton: {
    marginTop: 24,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 24,
    borderRadius: 8,
    padding: 24,
  },
  completionContainer: {
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  completionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  completionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  completionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  offlineChip: {
    backgroundColor: '#FF9800',
    height: 24,
    marginRight: 16,
  },
});

export default LessonScreen;
