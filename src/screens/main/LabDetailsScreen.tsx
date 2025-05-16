import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { MainStackParamList } from '../../navigation/types';

type LabDetailsRouteProp = RouteProp<MainStackParamList, 'LabDetails'>;
type LabDetailsNavigationProp = StackNavigationProp<MainStackParamList, 'LabDetails'>;

// Mock lab data
const labData = {
  '1': {
    id: '1',
    title: 'Network Scanning Lab',
    description: 'Learn how to use Nmap for network reconnaissance and vulnerability scanning.',
    category: 'Network Security',
    difficulty: 'Intermediate',
    duration: '45 minutes',
    status: 'available',
    image: 'https://via.placeholder.com/500x300',
    objectives: [
      'Understand the basics of network scanning',
      'Learn how to use Nmap for host discovery',
      'Identify open ports and services',
      'Detect operating systems and service versions',
      'Analyze scan results and identify potential vulnerabilities',
    ],
    prerequisites: [
      'Basic networking knowledge',
      'Familiarity with command line interfaces',
      'Understanding of IP addressing and ports',
    ],
    tools: [
      'Nmap',
      'Wireshark',
      'Terminal/Command Prompt',
    ],
    instructions: `
# Network Scanning Lab

## Introduction
Network scanning is a crucial phase in the ethical hacking process. It helps identify active hosts, open ports, running services, and potential vulnerabilities on a target network.

## Lab Environment
In this lab, you will be working with a simulated network environment containing multiple hosts with various services running. Your goal is to discover and analyze these hosts using Nmap.

## Tasks

### Task 1: Host Discovery
1. Use Nmap to discover all active hosts on the network
2. Document the IP addresses of all discovered hosts
3. Identify the network topology

### Task 2: Port Scanning
1. Perform a comprehensive port scan on each discovered host
2. Identify open ports and the services running on them
3. Document your findings

### Task 3: Service Enumeration
1. Determine the version of services running on open ports
2. Identify the operating systems of the hosts
3. Look for potential vulnerabilities based on service versions

### Task 4: Advanced Scanning Techniques
1. Perform stealth scanning to evade detection
2. Use timing options to control scan speed
3. Utilize script scanning to identify specific vulnerabilities

## Deliverables
1. A complete report of all discovered hosts, ports, and services
2. Analysis of potential vulnerabilities
3. Recommendations for securing the network
    `,
    progress: 0,
  },
  '2': {
    id: '2',
    title: 'SQL Injection Workshop',
    description: 'Practice SQL injection techniques on vulnerable web applications.',
    category: 'Web Security',
    difficulty: 'Advanced',
    duration: '60 minutes',
    status: 'scheduled',
    scheduledDate: '2023-05-20T14:00:00Z',
    image: 'https://via.placeholder.com/500x300',
    objectives: [
      'Understand SQL injection vulnerabilities',
      'Learn different types of SQL injection attacks',
      'Practice exploiting SQL injection vulnerabilities',
      'Learn how to prevent SQL injection attacks',
    ],
    prerequisites: [
      'Basic understanding of SQL',
      'Familiarity with web applications',
      'Knowledge of HTTP requests',
    ],
    tools: [
      'Web browser',
      'Burp Suite',
      'SQLmap',
    ],
    instructions: `
# SQL Injection Workshop

## Introduction
SQL injection is a code injection technique that exploits vulnerabilities in web applications that use SQL databases. This lab will teach you how to identify and exploit SQL injection vulnerabilities.

## Lab Environment
You will be working with a deliberately vulnerable web application that contains various SQL injection vulnerabilities.

## Tasks

### Task 1: Authentication Bypass
1. Identify login forms that might be vulnerable to SQL injection
2. Use SQL injection techniques to bypass authentication
3. Document the techniques used and their effectiveness

### Task 2: Data Extraction
1. Extract database information using SQL injection
2. Retrieve user credentials and sensitive data
3. Map the database structure

### Task 3: Advanced Exploitation
1. Perform blind SQL injection when no output is visible
2. Use time-based techniques to extract data
3. Utilize automated tools like SQLmap

### Task 4: Prevention Techniques
1. Review the vulnerable code
2. Implement fixes to prevent SQL injection
3. Test the fixes to ensure they are effective

## Deliverables
1. Documentation of all vulnerabilities found
2. Explanation of exploitation techniques used
3. Recommendations for securing the application
    `,
    progress: 0,
  },
};

const LabDetailsScreen: React.FC = () => {
  const route = useRoute<LabDetailsRouteProp>();
  const navigation = useNavigation<LabDetailsNavigationProp>();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  const { labId } = route.params;
  const lab = labData[labId as keyof typeof labData];
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, instructions, terminal
  const [labStatus, setLabStatus] = useState(lab?.status || 'available'); // available, running, completed
  const [progress, setProgress] = useState(lab?.progress || 0);
  const [showModal, setShowModal] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Simulate loading lab data
  useEffect(() => {
    const loadLab = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      
      // Start entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    };

    loadLab();
  }, [fadeAnim, slideAnim]);

  // Handle start lab
  const handleStartLab = () => {
    setLabStatus('running');
    setActiveTab('instructions');
  };

  // Handle complete lab
  const handleCompleteLab = () => {
    setShowModal(true);
  };

  // Handle submit lab
  const handleSubmitLab = () => {
    setShowModal(false);
    setLabStatus('completed');
    setProgress(100);
    Alert.alert('Success', 'Lab completed successfully! Your results have been saved.');
  };

  // Determine color based on difficulty
  const getDifficultyColor = () => {
    if (!lab) return colors.info;
    
    switch (lab.difficulty) {
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

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? colors.darker : colors.lighter }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: isDark ? colors.white : colors.dark }]}>
          Loading lab...
        </Text>
      </View>
    );
  }

  if (!lab) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: isDark ? colors.darker : colors.lighter }]}>
        <Text style={[styles.errorText, { color: isDark ? colors.white : colors.dark }]}>
          Lab not found
        </Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.darker : colors.lighter }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Lab Header */}
          <Image
            source={{ uri: lab.image }}
            style={styles.labImage}
            resizeMode="cover"
          />
          
          <View style={styles.labHeader}>
            <Text
              style={[
                styles.labTitle,
                { color: isDark ? colors.white : colors.dark },
              ]}
            >
              {lab.title}
            </Text>
            
            <View style={styles.labMeta}>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor() },
                ]}
              >
                <Text style={styles.difficultyText}>{lab.difficulty}</Text>
              </View>
              
              <Text
                style={[
                  styles.labDuration,
                  { color: isDark ? colors.lightGray : colors.gray },
                ]}
              >
                {lab.duration}
              </Text>
            </View>
            
            <Text
              style={[
                styles.labDescription,
                { color: isDark ? colors.lightGray : colors.gray },
              ]}
            >
              {lab.description}
            </Text>
          </View>
          
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'overview' && [
                  styles.activeTabButton,
                  { borderBottomColor: colors.primary },
                ],
              ]}
              onPress={() => setActiveTab('overview')}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color:
                      activeTab === 'overview'
                        ? colors.primary
                        : isDark
                        ? colors.lightGray
                        : colors.gray,
                  },
                ]}
              >
                Overview
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'instructions' && [
                  styles.activeTabButton,
                  { borderBottomColor: colors.primary },
                ],
              ]}
              onPress={() => setActiveTab('instructions')}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color:
                      activeTab === 'instructions'
                        ? colors.primary
                        : isDark
                        ? colors.lightGray
                        : colors.gray,
                  },
                ]}
              >
                Instructions
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'terminal' && [
                  styles.activeTabButton,
                  { borderBottomColor: colors.primary },
                ],
                labStatus !== 'running' && styles.disabledTabButton,
              ]}
              onPress={() => labStatus === 'running' && setActiveTab('terminal')}
              disabled={labStatus !== 'running'}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color:
                      activeTab === 'terminal'
                        ? colors.primary
                        : labStatus !== 'running'
                        ? isDark
                          ? colors.darkGray
                          : colors.lightGray
                        : isDark
                        ? colors.lightGray
                        : colors.gray,
                  },
                ]}
              >
                Terminal
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Tab Content */}
          <View
            style={[
              styles.tabContent,
              { backgroundColor: isDark ? colors.darkGray : colors.white },
            ]}
          >
            {activeTab === 'overview' && (
              <View>
                {/* Objectives */}
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: isDark ? colors.white : colors.dark },
                    ]}
                  >
                    Learning Objectives
                  </Text>
                  {lab.objectives.map((objective, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text
                        style={[
                          styles.listItemText,
                          { color: isDark ? colors.lightGray : colors.gray },
                        ]}
                      >
                        {objective}
                      </Text>
                    </View>
                  ))}
                </View>
                
                {/* Prerequisites */}
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: isDark ? colors.white : colors.dark },
                    ]}
                  >
                    Prerequisites
                  </Text>
                  {lab.prerequisites.map((prerequisite, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text
                        style={[
                          styles.listItemText,
                          { color: isDark ? colors.lightGray : colors.gray },
                        ]}
                      >
                        {prerequisite}
                      </Text>
                    </View>
                  ))}
                </View>
                
                {/* Tools */}
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: isDark ? colors.white : colors.dark },
                    ]}
                  >
                    Tools Used
                  </Text>
                  {lab.tools.map((tool, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text
                        style={[
                          styles.listItemText,
                          { color: isDark ? colors.lightGray : colors.gray },
                        ]}
                      >
                        {tool}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {activeTab === 'instructions' && (
              <View style={styles.instructionsContainer}>
                <Text
                  style={[
                    styles.instructionsText,
                    { color: isDark ? colors.lightGray : colors.gray },
                  ]}
                >
                  {lab.instructions}
                </Text>
              </View>
            )}
            
            {activeTab === 'terminal' && (
              <View style={styles.terminalContainer}>
                <View
                  style={[
                    styles.terminal,
                    { backgroundColor: isDark ? colors.black : colors.darkGray },
                  ]}
                >
                  <Text style={styles.terminalText}>
                    Welcome to the Ethical Hacking LMS Terminal{'\n'}
                    Type 'help' to see available commands{'\n\n'}
                    $ _
                  </Text>
                </View>
                <Text
                  style={[
                    styles.terminalNote,
                    { color: isDark ? colors.lightGray : colors.gray },
                  ]}
                >
                  Note: This is a simulated terminal for demonstration purposes.
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
      
      {/* Action Buttons */}
      <View
        style={[
          styles.actionContainer,
          { backgroundColor: isDark ? colors.darkGray : colors.white },
        ]}
      >
        {labStatus === 'available' && (
          <Button
            title="Start Lab"
            onPress={handleStartLab}
            fullWidth
          />
        )}
        
        {labStatus === 'running' && (
          <Button
            title="Complete Lab"
            onPress={handleCompleteLab}
            fullWidth
          />
        )}
        
        {labStatus === 'completed' && (
          <Button
            title="Restart Lab"
            onPress={handleStartLab}
            variant="outline"
            fullWidth
          />
        )}
      </View>
      
      {/* Completion Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? colors.darkGray : colors.white },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? colors.white : colors.dark },
              ]}
            >
              Complete Lab
            </Text>
            <Text
              style={[
                styles.modalText,
                { color: isDark ? colors.lightGray : colors.gray },
              ]}
            >
              Are you sure you want to complete this lab? This will submit your work and mark the lab as completed.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Submit"
                onPress={handleSubmitLab}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 16,
  },
  labImage: {
    width: '100%',
    height: 200,
  },
  labHeader: {
    padding: 16,
  },
  labTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  labMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  labDuration: {
    fontSize: 14,
  },
  labDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
  },
  disabledTabButton: {
    opacity: 0.5,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    marginRight: 8,
    fontSize: 16,
    color: '#666',
  },
  listItemText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  instructionsContainer: {
    padding: 8,
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  terminalContainer: {
    padding: 8,
  },
  terminal: {
    padding: 12,
    borderRadius: 4,
    minHeight: 200,
  },
  terminalText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#00ff00',
  },
  terminalNote: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  actionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 8,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    marginLeft: 12,
    minWidth: 100,
  },
});

export default LabDetailsScreen;
