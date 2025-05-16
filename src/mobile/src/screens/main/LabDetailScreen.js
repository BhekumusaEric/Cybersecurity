import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Divider,
  Chip,
  Portal,
  Modal,
  ActivityIndicator,
  IconButton,
  ProgressBar,
  Appbar,
} from 'react-native-paper';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import MarkdownDisplay from 'react-native-markdown-display';
import LabTerminal from '../../components/labs/LabTerminal';
import LabControls from '../../components/labs/LabControls';
import OfflineLabSimulation from '../../components/labs/OfflineLabSimulation';

const { width, height } = Dimensions.get('window');

const LabDetailScreen = ({ route, navigation }) => {
  const { labId } = route.params;
  const { theme } = useTheme();
  const { isOnline, offlineData, downloadContent } = useOffline();
  
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [labStatus, setLabStatus] = useState('stopped'); // 'loading', 'running', 'stopped', 'error'
  const [activeTab, setActiveTab] = useState('instructions'); // 'instructions', 'terminal', 'gui'
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  
  const webViewRef = useRef(null);
  
  // Handle back button press in fullscreen mode
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (fullscreen) {
          setFullscreen(false);
          return true;
        }
        return false;
      };
      
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [fullscreen])
  );
  
  // Load lab data
  useEffect(() => {
    const fetchLab = async () => {
      try {
        setLoading(true);
        
        // Check if lab is available offline
        const offlineLab = offlineData.labs.find(l => l.id === labId);
        
        if (offlineLab) {
          setLab(offlineLab);
          setIsDownloaded(true);
        } else if (isOnline) {
          // Fetch from API in a real implementation
          // For now, use mock data
          const mockLab = {
            id: labId,
            title: 'Network Scanning with Nmap',
            description: 'Learn how to use Nmap for network reconnaissance and vulnerability scanning.',
            difficulty: 'Intermediate',
            duration: '45 minutes',
            prerequisites: ['Basic networking knowledge', 'Command line familiarity'],
            tools: ['Nmap', 'Wireshark', 'Metasploit'],
            instructions: `
# Network Scanning Lab

In this lab, you will learn how to use Nmap for network reconnaissance.

## Objectives
1. Discover live hosts on a network
2. Identify open ports and services
3. Detect operating systems and service versions
4. Scan for vulnerabilities

## Instructions

### Step 1: Basic Scanning
Start with a basic scan of the target network:

\`\`\`bash
nmap 192.168.1.0/24
\`\`\`

### Step 2: Port Scanning
Perform a more detailed port scan:

\`\`\`bash
nmap -p 1-1000 192.168.1.100
\`\`\`

### Step 3: Service Detection
Identify services running on open ports:

\`\`\`bash
nmap -sV 192.168.1.100
\`\`\`

### Step 4: OS Detection
Attempt to determine the operating system:

\`\`\`bash
nmap -O 192.168.1.100
\`\`\`

### Step 5: Vulnerability Scanning
Check for known vulnerabilities:

\`\`\`bash
nmap --script vuln 192.168.1.100
\`\`\`

## Completion Criteria
- Successfully identify all live hosts on the network
- Correctly identify the operating system of the target
- Find at least 5 open ports and identify their services
- Discover at least 2 potential vulnerabilities
            `,
            topology: {
              nodes: [
                { id: 'attacker', label: 'Kali Linux', type: 'attacker' },
                { id: 'target1', label: 'Web Server', type: 'target' },
                { id: 'target2', label: 'Database Server', type: 'target' },
                { id: 'router', label: 'Router', type: 'network' },
              ],
              edges: [
                { from: 'attacker', to: 'router' },
                { from: 'router', to: 'target1' },
                { from: 'router', to: 'target2' },
                { from: 'target1', to: 'target2' },
              ],
            },
          };
          
          setLab(mockLab);
        } else {
          Alert.alert(
            'Offline Mode',
            'This lab is not available offline. Please connect to the internet or download the lab for offline use.',
            [{ text: 'OK' }]
          );
        }
        
        // Load progress
        const savedProgress = await AsyncStorage.getItem(`lab_progress_${labId}`);
        if (savedProgress) {
          setProgress(parseFloat(savedProgress));
        }
      } catch (error) {
        console.log('Fetch lab error:', error);
        Alert.alert('Error', 'Failed to load lab details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLab();
  }, [labId, isOnline, offlineData.labs]);
  
  // Start lab
  const startLab = () => {
    if (!isOnline && !isDownloaded) {
      Alert.alert(
        'Offline Mode',
        'You need to download this lab for offline use before starting it in offline mode.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setLabStatus('loading');
    
    // Simulate lab startup
    setTimeout(() => {
      setLabStatus('running');
      setActiveTab('terminal');
    }, 2000);
  };
  
  // Stop lab
  const stopLab = () => {
    setLabStatus('loading');
    
    // Simulate lab shutdown
    setTimeout(() => {
      setLabStatus('stopped');
      setActiveTab('instructions');
    }, 1500);
  };
  
  // Reset lab
  const resetLab = () => {
    if (labStatus === 'running') {
      Alert.alert(
        'Reset Lab',
        'Are you sure you want to reset the lab? All progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset',
            onPress: () => {
              // Simulate lab reset
              setLabStatus('loading');
              setTimeout(() => {
                setLabStatus('running');
              }, 1500);
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Lab must be running to reset.');
    }
  };
  
  // Download lab for offline use
  const handleDownload = async () => {
    if (!isOnline) {
      Alert.alert(
        'Offline Mode',
        'You need to be online to download labs for offline use.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    const result = await downloadContent('lab', labId);
    
    if (result.success) {
      setIsDownloaded(true);
      Alert.alert('Success', 'Lab downloaded for offline use');
    } else {
      Alert.alert('Error', result.message || 'Failed to download lab');
    }
  };
  
  // Update progress
  const updateProgress = async (newProgress) => {
    setProgress(newProgress);
    await AsyncStorage.setItem(`lab_progress_${labId}`, newProgress.toString());
  };
  
  // Render loading state
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading lab...</Text>
      </View>
    );
  }
  
  // Render lab not found
  if (!lab) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text>Lab not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          Go Back
        </Button>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      {!fullscreen && (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={lab.title} />
          {isDownloaded ? (
            <Appbar.Action icon="check-circle" color="#4CAF50" />
          ) : (
            <Appbar.Action icon="download" onPress={handleDownload} />
          )}
          <Appbar.Action icon="camera" onPress={() => setShowCameraModal(true)} />
        </Appbar.Header>
      )}
      
      {/* Content */}
      {fullscreen ? (
        <View style={styles.fullscreenContainer}>
          {activeTab === 'terminal' && (
            <LabTerminal />
          )}
          
          {activeTab === 'gui' && (
            isOnline ? (
              <WebView
                ref={webViewRef}
                source={{ uri: 'https://example.com/lab-environment' }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            ) : (
              <OfflineLabSimulation lab={lab} />
            )
          )}
          
          <TouchableOpacity
            style={styles.exitFullscreenButton}
            onPress={() => setFullscreen(false)}
          >
            <Icon name="fullscreen-exit" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Lab Info */}
          <ScrollView style={styles.scrollView}>
            <Card style={styles.infoCard}>
              <Card.Content>
                <Text style={styles.description}>{lab.description}</Text>
                
                <View style={styles.metaContainer}>
                  <Chip icon="clock-outline" style={styles.chip}>
                    {lab.duration}
                  </Chip>
                  <Chip icon="school" style={styles.chip}>
                    {lab.difficulty}
                  </Chip>
                </View>
                
                <Divider style={styles.divider} />
                
                <Text style={styles.sectionTitle}>Prerequisites</Text>
                <View style={styles.listContainer}>
                  {lab.prerequisites.map((prerequisite, index) => (
                    <View key={index} style={styles.listItem}>
                      <Icon name="check-circle" size={16} color={theme.colors.primary} />
                      <Text style={styles.listItemText}>{prerequisite}</Text>
                    </View>
                  ))}
                </View>
                
                <Text style={styles.sectionTitle}>Tools Used</Text>
                <View style={styles.toolsContainer}>
                  {lab.tools.map((tool, index) => (
                    <Chip key={index} style={styles.toolChip}>
                      {tool}
                    </Chip>
                  ))}
                </View>
                
                <Divider style={styles.divider} />
                
                <Text style={styles.sectionTitle}>Progress</Text>
                <ProgressBar
                  progress={progress}
                  color={theme.colors.primary}
                  style={styles.progressBar}
                />
                <Text style={styles.progressText}>{Math.round(progress * 100)}% Complete</Text>
              </Card.Content>
            </Card>
            
            {/* Lab Content */}
            <Card style={styles.contentCard}>
              <Card.Content>
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      activeTab === 'instructions' && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab('instructions')}
                  >
                    <Icon
                      name="file-document-outline"
                      size={20}
                      color={activeTab === 'instructions' ? theme.colors.primary : '#666'}
                    />
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === 'instructions' && styles.activeTabText,
                      ]}
                    >
                      Instructions
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      activeTab === 'terminal' && styles.activeTab,
                    ]}
                    onPress={() => {
                      if (labStatus === 'running') {
                        setActiveTab('terminal');
                      } else {
                        Alert.alert('Lab Not Running', 'Start the lab to access the terminal.');
                      }
                    }}
                  >
                    <Icon
                      name="console"
                      size={20}
                      color={activeTab === 'terminal' ? theme.colors.primary : '#666'}
                    />
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === 'terminal' && styles.activeTabText,
                      ]}
                    >
                      Terminal
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      activeTab === 'gui' && styles.activeTab,
                    ]}
                    onPress={() => {
                      if (labStatus === 'running') {
                        setActiveTab('gui');
                      } else {
                        Alert.alert('Lab Not Running', 'Start the lab to access the GUI.');
                      }
                    }}
                  >
                    <Icon
                      name="application"
                      size={20}
                      color={activeTab === 'gui' ? theme.colors.primary : '#666'}
                    />
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === 'gui' && styles.activeTabText,
                      ]}
                    >
                      GUI
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <Divider style={styles.divider} />
                
                <View style={styles.tabContent}>
                  {activeTab === 'instructions' && (
                    <MarkdownDisplay markdown={lab.instructions} />
                  )}
                  
                  {activeTab === 'terminal' && (
                    labStatus === 'running' ? (
                      <View style={styles.terminalContainer}>
                        <LabTerminal />
                        <Button
                          mode="contained"
                          icon="fullscreen"
                          onPress={() => setFullscreen(true)}
                          style={styles.fullscreenButton}
                        >
                          Fullscreen
                        </Button>
                      </View>
                    ) : (
                      <View style={styles.placeholderContainer}>
                        <Icon name="console" size={48} color="#ccc" />
                        <Text style={styles.placeholderText}>
                          Terminal will be available when the lab is running
                        </Text>
                      </View>
                    )
                  )}
                  
                  {activeTab === 'gui' && (
                    labStatus === 'running' ? (
                      <View style={styles.guiContainer}>
                        {isOnline ? (
                          <>
                            <WebView
                              ref={webViewRef}
                              source={{ uri: 'https://example.com/lab-environment' }}
                              style={styles.webview}
                              javaScriptEnabled={true}
                              domStorageEnabled={true}
                            />
                            <Button
                              mode="contained"
                              icon="fullscreen"
                              onPress={() => setFullscreen(true)}
                              style={styles.fullscreenButton}
                            >
                              Fullscreen
                            </Button>
                          </>
                        ) : (
                          <OfflineLabSimulation lab={lab} />
                        )}
                      </View>
                    ) : (
                      <View style={styles.placeholderContainer}>
                        <Icon name="application" size={48} color="#ccc" />
                        <Text style={styles.placeholderText}>
                          GUI will be available when the lab is running
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
          
          {/* Lab Controls */}
          <LabControls
            status={labStatus}
            onStart={startLab}
            onStop={stopLab}
            onReset={resetLab}
            isOnline={isOnline}
            isDownloaded={isDownloaded}
          />
        </>
      )}
      
      {/* Camera Modal */}
      <Portal>
        <Modal
          visible={showCameraModal}
          onDismiss={() => setShowCameraModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Capture Lab Evidence</Text>
          <Text style={styles.modalText}>
            This feature would allow you to take photos of your lab work for documentation or submission.
          </Text>
          <Button
            mode="contained"
            icon="camera"
            onPress={() => {
              // In a real implementation, this would open the camera
              setShowCameraModal(false);
              Alert.alert('Camera', 'This would open the device camera in a real implementation.');
            }}
            style={styles.modalButton}
          >
            Open Camera
          </Button>
          <Button
            mode="outlined"
            onPress={() => setShowCameraModal(false)}
            style={styles.modalButton}
          >
            Cancel
          </Button>
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
  scrollView: {
    flex: 1,
  },
  infoCard: {
    margin: 16,
    elevation: 2,
  },
  contentCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    marginBottom: 80, // Space for controls
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listContainer: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemText: {
    marginLeft: 8,
  },
  toolsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  toolChip: {
    margin: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  progressText: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1976d2',
  },
  tabText: {
    marginLeft: 8,
    color: '#666',
  },
  activeTabText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  tabContent: {
    minHeight: 300,
  },
  terminalContainer: {
    height: 400,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  guiContainer: {
    height: 400,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  webview: {
    flex: 1,
  },
  placeholderContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  placeholderText: {
    marginTop: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  exitFullscreenButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 8,
  },
});

export default LabDetailScreen;
