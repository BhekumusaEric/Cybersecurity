/**
 * Lesson Screen
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock data
const lessonData = {
  id: '5',
  title: 'Active Reconnaissance',
  duration: '30 min',
  completed: false,
  content: `
# Active Reconnaissance

Active reconnaissance involves directly interacting with the target system to gather information. Unlike passive reconnaissance, active methods involve sending packets or requests to the target, which can potentially be detected by the target's security systems.

## Common Active Reconnaissance Techniques

### Port Scanning

Port scanning is the process of checking a target system for open ports. Open ports can reveal services running on the target, which can be potential entry points for attackers.

#### Common Port Scanning Tools:
- **Nmap**: The most popular port scanning tool
- **Masscan**: Faster than Nmap but less detailed
- **Unicornscan**: Asynchronous port scanner

### Banner Grabbing

Banner grabbing is the technique of retrieving banner information from services running on open ports. Banners often reveal the service type and version, which can be used to identify vulnerabilities.

#### Example of Banner Grabbing:
\`\`\`
telnet target.com 80
GET / HTTP/1.1
Host: target.com
\`\`\`

### Vulnerability Scanning

Vulnerability scanning involves using automated tools to scan for known vulnerabilities in the target system.

#### Common Vulnerability Scanners:
- **OpenVAS**: Open Vulnerability Assessment System
- **Nessus**: Commercial vulnerability scanner
- **Nexpose**: Rapid7's vulnerability scanner

## Ethical Considerations

When performing active reconnaissance, always ensure you have proper authorization. Active scanning without permission is illegal in many jurisdictions and can be considered a hostile act.

## Lab Exercise

In the next lab, you will practice active reconnaissance techniques using Nmap and other tools in a controlled environment.
  `,
  video: 'https://example.com/videos/active-reconnaissance.mp4',
  quiz: [
    {
      id: '1',
      question: 'Which of the following is NOT an active reconnaissance technique?',
      options: [
        'Port scanning',
        'Banner grabbing',
        'Google dorking',
        'Vulnerability scanning',
      ],
      correctAnswer: 2,
    },
    {
      id: '2',
      question: 'What is the most popular port scanning tool?',
      options: [
        'Wireshark',
        'Nmap',
        'Metasploit',
        'Burp Suite',
      ],
      correctAnswer: 1,
    },
    {
      id: '3',
      question: 'Why is active reconnaissance potentially detectable?',
      options: [
        'It requires special tools',
        'It involves direct interaction with the target',
        'It is always illegal',
        'It requires more time than passive reconnaissance',
      ],
      correctAnswer: 1,
    },
  ],
  nextLesson: {
    id: '6',
    title: 'Tools for Reconnaissance',
  },
  prevLesson: {
    id: '4',
    title: 'Passive Reconnaissance',
  },
};

const LessonScreen = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const { colors } = useTheme();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
  useEffect(() => {
    // Simulate API call to fetch lesson details
    const fetchLesson = async () => {
      try {
        // In a real app, you would fetch the lesson data from an API
        // For now, we'll use the mock data
        setTimeout(() => {
          setLesson(lessonData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching lesson:', error);
        setLoading(false);
      }
    };
    
    fetchLesson();
  }, [lessonId]);
  
  const handleAnswerSelect = (questionId, optionIndex) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };
  
  const handleQuizSubmit = () => {
    // Calculate score
    let correctAnswers = 0;
    
    lesson.quiz.forEach((question) => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = (correctAnswers / lesson.quiz.length) * 100;
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // In a real app, you would send the quiz results to the server
  };
  
  const handleMarkAsCompleted = () => {
    // In a real app, you would update the lesson status on the server
    alert('Lesson marked as completed!');
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
    },
    header: {
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    duration: {
      fontSize: 14,
      color: colors.text + '99',
    },
    videoContainer: {
      width: '100%',
      height: 200,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      borderRadius: 8,
    },
    lessonContent: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 24,
      marginBottom: 12,
    },
    subheading: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    paragraph: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 16,
      lineHeight: 24,
    },
    list: {
      marginLeft: 16,
      marginBottom: 16,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    listItemBullet: {
      fontSize: 16,
      color: colors.text,
      marginRight: 8,
    },
    listItemText: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    codeBlock: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    codeText: {
      fontFamily: 'monospace',
      fontSize: 14,
      color: colors.text,
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 32,
      marginBottom: 16,
    },
    navigationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    navigationButtonText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 8,
      marginRight: 8,
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
    quizContainer: {
      marginTop: 32,
    },
    quizTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    quizQuestion: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    quizOptions: {
      marginBottom: 24,
    },
    quizOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
    },
    quizOptionText: {
      fontSize: 16,
      marginLeft: 12,
    },
    quizResult: {
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 24,
      padding: 16,
      borderRadius: 8,
    },
    quizResultTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    quizResultScore: {
      fontSize: 48,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    quizResultMessage: {
      fontSize: 16,
      textAlign: 'center',
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
        <Text style={{ marginTop: 16, color: colors.text }}>Loading lesson...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="alert-circle" size={64} color={colors.error} />
        <Text style={{ marginTop: 16, color: colors.text }}>Failed to load lesson</Text>
        <TouchableOpacity
          style={[styles.actionButton, { marginTop: 24 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.actionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderQuizOption = (question, optionIndex, option) => {
    const isSelected = quizAnswers[question.id] === optionIndex;
    const isCorrect = quizSubmitted && question.correctAnswer === optionIndex;
    const isIncorrect = quizSubmitted && isSelected && !isCorrect;
    
    let backgroundColor = 'transparent';
    let borderColor = colors.border;
    let textColor = colors.text;
    
    if (quizSubmitted) {
      if (isCorrect) {
        backgroundColor = colors.success + '20';
        borderColor = colors.success;
        textColor = colors.success;
      } else if (isIncorrect) {
        backgroundColor = colors.error + '20';
        borderColor = colors.error;
        textColor = colors.error;
      }
    } else if (isSelected) {
      backgroundColor = colors.primary + '20';
      borderColor = colors.primary;
      textColor = colors.primary;
    }
    
    return (
      <TouchableOpacity
        key={optionIndex}
        style={[
          styles.quizOption,
          {
            backgroundColor,
            borderColor,
          },
        ]}
        onPress={() => !quizSubmitted && handleAnswerSelect(question.id, optionIndex)}
        disabled={quizSubmitted}
      >
        {quizSubmitted ? (
          isCorrect ? (
            <Icon name="check-circle" size={20} color={colors.success} />
          ) : isIncorrect ? (
            <Icon name="close-circle" size={20} color={colors.error} />
          ) : (
            <Icon name="circle-outline" size={20} color={colors.text + '50'} />
          )
        ) : (
          isSelected ? (
            <Icon name="circle-slice-8" size={20} color={colors.primary} />
          ) : (
            <Icon name="circle-outline" size={20} color={colors.text + '50'} />
          )
        )}
        <Text style={[styles.quizOptionText, { color: textColor }]}>{option}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.duration}>{lesson.duration}</Text>
        </View>
        
        <View style={styles.videoContainer}>
          <Icon name="play-circle" size={64} color={colors.primary} />
          <Text style={{ color: colors.text, marginTop: 8 }}>Video not available in demo</Text>
        </View>
        
        {!showQuiz ? (
          <>
            <Text style={styles.lessonContent}>{lesson.content}</Text>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowQuiz(true)}
            >
              <Text style={styles.actionButtonText}>Take Quiz</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.quizContainer}>
            <Text style={styles.quizTitle}>Quiz</Text>
            
            {quizSubmitted && (
              <View
                style={[
                  styles.quizResult,
                  {
                    backgroundColor:
                      quizScore >= 70
                        ? colors.success + '20'
                        : colors.error + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.quizResultTitle,
                    {
                      color: quizScore >= 70 ? colors.success : colors.error,
                    },
                  ]}
                >
                  {quizScore >= 70 ? 'Congratulations!' : 'Try Again'}
                </Text>
                <Text
                  style={[
                    styles.quizResultScore,
                    {
                      color: quizScore >= 70 ? colors.success : colors.error,
                    },
                  ]}
                >
                  {Math.round(quizScore)}%
                </Text>
                <Text
                  style={[
                    styles.quizResultMessage,
                    {
                      color: quizScore >= 70 ? colors.success : colors.error,
                    },
                  ]}
                >
                  {quizScore >= 70
                    ? 'You have successfully completed the quiz!'
                    : 'You need to score at least 70% to pass the quiz.'}
                </Text>
              </View>
            )}
            
            {lesson.quiz.map((question, index) => (
              <View key={question.id} style={{ marginBottom: 24 }}>
                <Text style={styles.quizQuestion}>
                  {index + 1}. {question.question}
                </Text>
                <View style={styles.quizOptions}>
                  {question.options.map((option, optionIndex) =>
                    renderQuizOption(question, optionIndex, option)
                  )}
                </View>
              </View>
            ))}
            
            {!quizSubmitted ? (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    opacity:
                      Object.keys(quizAnswers).length === lesson.quiz.length
                        ? 1
                        : 0.5,
                  },
                ]}
                onPress={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length !== lesson.quiz.length}
              >
                <Text style={styles.actionButtonText}>Submit Quiz</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleMarkAsCompleted}
              >
                <Text style={styles.actionButtonText}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setShowQuiz(false)}
            >
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                Back to Lesson
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.navigationButtons}>
          {lesson.prevLesson && (
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() =>
                navigation.replace('Lesson', { lessonId: lesson.prevLesson.id })
              }
            >
              <Icon name="chevron-left" size={20} color={colors.text} />
              <Text style={styles.navigationButtonText}>
                {lesson.prevLesson.title}
              </Text>
            </TouchableOpacity>
          )}
          
          <View style={{ flex: 1 }} />
          
          {lesson.nextLesson && (
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() =>
                navigation.replace('Lesson', { lessonId: lesson.nextLesson.id })
              }
            >
              <Text style={styles.navigationButtonText}>
                {lesson.nextLesson.title}
              </Text>
              <Icon name="chevron-right" size={20} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default LessonScreen;
