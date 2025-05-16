/**
 * Lab Detail Screen
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
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock data
const labData = {
  id: '2',
  title: 'SQL Injection Practice',
  description: 'Practice SQL injection techniques in a safe environment. This lab will teach you how to identify and exploit SQL injection vulnerabilities in web applications.',
  image: 'https://via.placeholder.com/400',
  difficulty: 'Intermediate',
  duration: '3 hours',
  status: 'inProgress', // 'completed', 'inProgress', 'notStarted'
  tools: ['SQLmap', 'Burp Suite'],
  prerequisites: [
    'Basic understanding of SQL',
    'Familiarity with web applications',
    'Knowledge of HTTP requests',
  ],
  objectives: [
    'Understand what SQL injection is and how it works',
    'Learn different types of SQL injection attacks',
    'Practice identifying and exploiting SQL injection vulnerabilities',
    'Implement prevention techniques',
  ],
  environment: {
    type: 'Virtual Machine',
    os: 'Kali Linux',
    resources: {
      cpu: '2 cores',
      memory: '4 GB',
      storage: '20 GB',
    },
  },
  steps: [
    {
      id: '1',
      title: 'Setup the Lab Environment',
      description: 'In this step, you will set up the lab environment and ensure all required tools are installed.',
      completed: true,
    },
    {
      id: '2',
      title: 'Identify Vulnerable Input Fields',
      description: 'Learn how to identify input fields that might be vulnerable to SQL injection attacks.',
      completed: true,
    },
    {
      id: '3',
      title: 'Basic SQL Injection Techniques',
      description: 'Practice basic SQL injection techniques to extract data from the database.',
      completed: false,
    },
    {
      id: '4',
      title: 'Advanced SQL Injection Techniques',
      description: 'Learn advanced SQL injection techniques such as blind SQL injection and time-based attacks.',
      completed: false,
    },
    {
      id: '5',
      title: 'Prevention Techniques',
      description: 'Implement prevention techniques to protect against SQL injection attacks.',
      completed: false,
    },
  ],
};

const LabDetailScreen = ({ route, navigation }) => {
  const { labId } = route.params;
  const { colors } = useTheme();
  const { isContentAvailableOffline, downloadContent, removeOfflineContent, isOnline } = useOffline();
  
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAvailableOffline, setIsAvailableOffline] = useState(false);
  const [labEnvironmentStatus, setLabEnvironmentStatus] = useState('stopped'); // 'running', 'starting', 'stopped', 'error'
  
  useEffect(() => {
    // Simulate API call to fetch lab details
    const fetchLab = async () => {
      try {
        // In a real app, you would fetch the lab data from an API
        // For now, we'll use the mock data
        setTimeout(() => {
          setLab(labData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching lab:', error);
        setLoading(false);
      }
    };
    
    fetchLab();
  }, [labId]);
  
  useEffect(() => {
    if (lab) {
      // Check if lab is available offline
      const checkOfflineAvailability = async () => {
        const available = await isContentAvailableOffline('lab', lab.id);
        setIsAvailableOffline(available);
      };
      
      checkOfflineAvailability();
    }
  }, [lab, isContentAvailableOffline]);
  
  const handleDownload = async () => {
    if (!isOnline) {
      Alert.alert('Error', 'You are offline. Cannot download content.');
      return;
    }
    
    setIsDownloading(true);
    try {
      const result = await downloadContent('lab', lab.id, true);
      if (result.success) {
        setIsAvailableOffline(true);
        Alert.alert('Success', 'Lab downloaded for offline use');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error downloading lab:', error);
      Alert.alert('Error', 'Failed to download lab');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleRemoveOffline = async () => {
    try {
      const result = await removeOfflineContent('lab', lab.id, true);
      if (result.success) {
        setIsAvailableOffline(false);
        Alert.alert('Success', 'Lab removed from offline content');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error removing lab from offline content:', error);
      Alert.alert('Error', 'Failed to remove lab from offline content');
    }
  };
  
  const handleStartLab = () => {
    if (!isOnline) {
      Alert.alert('Error', 'You need to be online to start the lab environment.');
      return;
    }
    
    setLabEnvironmentStatus('starting');
    
    // Simulate starting the lab environment
    setTimeout(() => {
      setLabEnvironmentStatus('running');
      Alert.alert('Success', 'Lab environment is now running');
    }, 3000);
  };
  
  const handleStopLab = () => {
    setLabEnvironmentStatus('stopped');
    Alert.alert('Success', 'Lab environment has been stopped');
  };
  
  const handleCompleteStep = (stepId) => {
    // In a real app, you would update the step status on the server
    setLab((prevLab) => ({
      ...prevLab,
      steps: prevLab.steps.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      ),
    }));
  };
  
  const calculateProgress = () => {
    if (!lab) return 0;
    
    const completedSteps = lab.steps.filter((step) => step.completed).length;
    return (completedSteps / lab.steps.length) * 100;
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
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    statusText: {
      fontSize: 14,
      marginLeft: 4,
    },
    toolsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    toolChip: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: 8,
      marginBottom: 8,
    },
    toolChipText: {
      fontSize: 12,
      color: colors.primary,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 24,
      marginBottom: 12,
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
    environmentCard: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    environmentTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    environmentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    environmentLabel: {
      fontSize: 14,
      color: colors.text + '99',
    },
    environmentValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    environmentStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
    },
    environmentStatusText: {
      fontSize: 14,
      marginLeft: 8,
    },
    environmentButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    environmentButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    environmentButtonText: {
      fontSize: 14,
      fontWeight: '500',
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
    stepCard: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    stepHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    stepNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    stepNumberText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    stepTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
    },
    stepDescription: {
      fontSize: 14,
      color: colors.text + '99',
      marginBottom: 12,
    },
    stepButton: {
      alignSelf: 'flex-end',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    stepButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '500',
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
        <Text style={{ marginTop: 16, color: colors.text }}>Loading lab...</Text>
      </View>
    );
  }

  if (!lab) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="alert-circle" size={64} color={colors.error} />
        <Text style={{ marginTop: 16, color: colors.text }}>Failed to load lab</Text>
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
  const nextIncompleteStep = lab.steps.find((step) => !step.completed);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'inProgress':
        return colors.warning;
      case 'notStarted':
      default:
        return colors.text + '99';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'inProgress':
        return 'In Progress';
      case 'notStarted':
      default:
        return 'Not Started';
    }
  };

  const getEnvironmentStatusColor = (status) => {
    switch (status) {
      case 'running':
        return colors.success;
      case 'starting':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'stopped':
      default:
        return colors.text + '99';
    }
  };

  const getEnvironmentStatusText = (status) => {
    switch (status) {
      case 'running':
        return 'Running';
      case 'starting':
        return 'Starting...';
      case 'error':
        return 'Error';
      case 'stopped':
      default:
        return 'Stopped';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: lab.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{lab.title}</Text>
        <Text style={styles.description}>{lab.description}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Icon name="speedometer" size={16} color={colors.text + '99'} />
            <Text style={styles.metaText}>{lab.difficulty}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="clock-outline" size={16} color={colors.text + '99'} />
            <Text style={styles.metaText}>{lab.duration}</Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <Icon
            name={
              lab.status === 'completed'
                ? 'check-circle'
                : lab.status === 'inProgress'
                ? 'progress-clock'
                : 'circle-outline'
            }
            size={16}
            color={getStatusColor(lab.status)}
          />
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(lab.status) },
            ]}
          >
            {getStatusText(lab.status)}
          </Text>
        </View>
        
        <Text style={styles.sectionTitle}>Tools</Text>
        <View style={styles.toolsContainer}>
          {lab.tools.map((tool, index) => (
            <View key={index} style={styles.toolChip}>
              <Text style={styles.toolChipText}>{tool}</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Prerequisites</Text>
        {lab.prerequisites.map((prerequisite, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemBullet}>•</Text>
            <Text style={styles.listItemText}>{prerequisite}</Text>
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>Objectives</Text>
        {lab.objectives.map((objective, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemBullet}>•</Text>
            <Text style={styles.listItemText}>{objective}</Text>
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>Lab Environment</Text>
        <View style={styles.environmentCard}>
          <Text style={styles.environmentTitle}>Virtual Machine Details</Text>
          
          <View style={styles.environmentRow}>
            <Text style={styles.environmentLabel}>Type</Text>
            <Text style={styles.environmentValue}>{lab.environment.type}</Text>
          </View>
          
          <View style={styles.environmentRow}>
            <Text style={styles.environmentLabel}>Operating System</Text>
            <Text style={styles.environmentValue}>{lab.environment.os}</Text>
          </View>
          
          <View style={styles.environmentRow}>
            <Text style={styles.environmentLabel}>CPU</Text>
            <Text style={styles.environmentValue}>{lab.environment.resources.cpu}</Text>
          </View>
          
          <View style={styles.environmentRow}>
            <Text style={styles.environmentLabel}>Memory</Text>
            <Text style={styles.environmentValue}>{lab.environment.resources.memory}</Text>
          </View>
          
          <View style={styles.environmentRow}>
            <Text style={styles.environmentLabel}>Storage</Text>
            <Text style={styles.environmentValue}>{lab.environment.resources.storage}</Text>
          </View>
          
          <View style={styles.environmentStatus}>
            <Icon
              name={
                labEnvironmentStatus === 'running'
                  ? 'server'
                  : labEnvironmentStatus === 'starting'
                  ? 'server-network'
                  : labEnvironmentStatus === 'error'
                  ? 'server-off'
                  : 'server-off'
              }
              size={20}
              color={getEnvironmentStatusColor(labEnvironmentStatus)}
            />
            <Text
              style={[
                styles.environmentStatusText,
                { color: getEnvironmentStatusColor(labEnvironmentStatus) },
              ]}
            >
              {getEnvironmentStatusText(labEnvironmentStatus)}
            </Text>
          </View>
          
          <View style={styles.environmentButtons}>
            {labEnvironmentStatus === 'running' ? (
              <>
                <TouchableOpacity
                  style={[
                    styles.environmentButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => {
                    // In a real app, this would open the lab environment
                    Alert.alert('Connect', 'Connecting to lab environment...');
                  }}
                >
                  <Text style={[styles.environmentButtonText, { color: '#FFFFFF' }]}>
                    Connect
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.environmentButton,
                    { backgroundColor: colors.error + '20' },
                  ]}
                  onPress={handleStopLab}
                >
                  <Text style={[styles.environmentButtonText, { color: colors.error }]}>
                    Stop
                  </Text>
                </TouchableOpacity>
              </>
            ) : labEnvironmentStatus === 'starting' ? (
              <View
                style={[
                  styles.environmentButton,
                  { backgroundColor: colors.border },
                ]}
              >
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.environmentButton,
                  { backgroundColor: colors.success + '20' },
                ]}
                onPress={handleStartLab}
              >
                <Text style={[styles.environmentButtonText, { color: colors.success }]}>
                  Start Environment
                </Text>
              </TouchableOpacity>
            )}
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
        
        <Text style={styles.sectionTitle}>Lab Steps</Text>
        {lab.steps.map((step, index) => (
          <View key={step.id} style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              {step.completed && (
                <Icon name="check-circle" size={20} color={colors.success} />
              )}
            </View>
            <Text style={styles.stepDescription}>{step.description}</Text>
            {!step.completed && (
              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => handleCompleteStep(step.id)}
              >
                <Text style={styles.stepButtonText}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        {nextIncompleteStep && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // In a real app, this would navigate to the step details
              Alert.alert('Step Details', `Starting step: ${nextIncompleteStep.title}`);
            }}
          >
            <Text style={styles.actionButtonText}>
              {lab.status === 'notStarted' ? 'Start Lab' : 'Continue Lab'}
            </Text>
          </TouchableOpacity>
        )}
        
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
      </View>
    </ScrollView>
  );
};

export default LabDetailScreen;
