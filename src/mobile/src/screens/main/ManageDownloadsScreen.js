import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  ActivityIndicator,
  Chip,
  List,
  IconButton,
  ProgressBar,
  Menu,
  Portal,
  Dialog,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { formatBytes } from '../../utils/formatters';

import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import {
  getOfflineData,
  getOfflineContentSize,
  removeOfflineContent,
  clearAllOfflineContent,
} from '../../services/OfflineContentService';

const ManageDownloadsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { isOnline } = useOffline();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offlineData, setOfflineData] = useState(null);
  const [sizeInfo, setSizeInfo] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('courses'); // 'courses', 'lessons', 'labs', 'assessments'
  const [menuVisible, setMenuVisible] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  // Load offline data
  const loadOfflineData = async () => {
    try {
      setError(null);
      
      // Get offline data
      const data = await getOfflineData();
      setOfflineData(data);
      
      // Get size information
      const size = await getOfflineContentSize();
      setSizeInfo(size);
    } catch (err) {
      console.error('Error loading offline data:', err);
      setError('Failed to load offline data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Load data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadOfflineData();
    }, [])
  );
  
  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadOfflineData();
  };
  
  // Handle remove content
  const handleRemoveContent = (contentType, contentId, title) => {
    Alert.alert(
      'Remove Content',
      `Are you sure you want to remove "${title}" from offline content?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          onPress: async () => {
            try {
              const result = await removeOfflineContent(contentType, contentId);
              
              if (result.success) {
                // Reload offline data
                loadOfflineData();
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (err) {
              console.error('Error removing content:', err);
              Alert.alert('Error', 'Failed to remove content. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Handle clear all content
  const handleClearAllContent = async () => {
    try {
      const result = await clearAllOfflineContent();
      
      if (result.success) {
        // Reload offline data
        loadOfflineData();
        setShowClearDialog(false);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (err) {
      console.error('Error clearing content:', err);
      Alert.alert('Error', 'Failed to clear content. Please try again.');
    }
  };
  
  // Render course item
  const renderCourseItem = ({ item }) => (
    <Card style={styles.contentCard}>
      <Card.Content>
        <View style={styles.contentHeader}>
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <Text style={styles.contentMeta}>
              {item.lessons || 0} lessons • {item.duration || 'Unknown'}
            </Text>
          </View>
          
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleRemoveContent('course', item.id, item.title)}
          />
        </View>
        
        {item.progress !== undefined && (
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={item.progress}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {Math.round(item.progress * 100)}% Complete
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
  
  // Render lesson item
  const renderLessonItem = ({ item }) => (
    <Card style={styles.contentCard}>
      <Card.Content>
        <View style={styles.contentHeader}>
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <Text style={styles.contentMeta}>
              {item.courseName || 'Unknown course'} • {item.duration || 'Unknown'}
            </Text>
          </View>
          
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleRemoveContent('lesson', item.id, item.title)}
          />
        </View>
      </Card.Content>
    </Card>
  );
  
  // Render lab item
  const renderLabItem = ({ item }) => (
    <Card style={styles.contentCard}>
      <Card.Content>
        <View style={styles.contentHeader}>
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <Text style={styles.contentMeta}>
              {item.difficulty || 'Unknown'} • {item.duration || 'Unknown'}
            </Text>
          </View>
          
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleRemoveContent('lab', item.id, item.title)}
          />
        </View>
      </Card.Content>
    </Card>
  );
  
  // Render assessment item
  const renderAssessmentItem = ({ item }) => (
    <Card style={styles.contentCard}>
      <Card.Content>
        <View style={styles.contentHeader}>
          <View style={styles.contentInfo}>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <Text style={styles.contentMeta}>
              {item.type || 'Unknown type'} • {item.duration || 'Unknown'}
            </Text>
          </View>
          
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleRemoveContent('assessment', item.id, item.title)}
          />
        </View>
      </Card.Content>
    </Card>
  );
  
  // Get content data based on selected tab
  const getContentData = () => {
    if (!offlineData) return [];
    
    switch (selectedTab) {
      case 'courses':
        return offlineData.courses || [];
      case 'lessons':
        return offlineData.lessons || [];
      case 'labs':
        return offlineData.labs || [];
      case 'assessments':
        return offlineData.assessments || [];
      default:
        return [];
    }
  };
  
  // Get content renderer based on selected tab
  const getContentRenderer = () => {
    switch (selectedTab) {
      case 'courses':
        return renderCourseItem;
      case 'lessons':
        return renderLessonItem;
      case 'labs':
        return renderLabItem;
      case 'assessments':
        return renderAssessmentItem;
      default:
        return null;
    }
  };
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="download-off" size={64} color="#BDBDBD" />
      <Text style={styles.emptyStateTitle}>No Downloaded Content</Text>
      <Text style={styles.emptyStateText}>
        You don't have any {selectedTab} downloaded for offline use.
      </Text>
    </View>
  );
  
  // Render loading state
  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading offline content...</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Manage Downloads" />
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action 
              icon="dots-vertical" 
              onPress={() => setMenuVisible(true)} 
            />
          }
        >
          <Menu.Item 
            title="Clear All Downloads" 
            onPress={() => {
              setMenuVisible(false);
              setShowClearDialog(true);
            }}
            leadingIcon="delete-sweep"
          />
        </Menu>
      </Appbar.Header>
      
      {/* Storage Info */}
      {sizeInfo && (
        <Card style={styles.storageCard}>
          <Card.Content>
            <View style={styles.storageHeader}>
              <Text style={styles.storageTitle}>Storage Usage</Text>
              <Text style={styles.storageSize}>
                {formatBytes(sizeInfo.totalSize)}
              </Text>
            </View>
            
            <View style={styles.storageDetails}>
              <View style={styles.storageItem}>
                <Text style={styles.storageItemCount}>{sizeInfo.courseCount}</Text>
                <Text style={styles.storageItemLabel}>Courses</Text>
              </View>
              
              <View style={styles.storageItem}>
                <Text style={styles.storageItemCount}>{sizeInfo.lessonCount}</Text>
                <Text style={styles.storageItemLabel}>Lessons</Text>
              </View>
              
              <View style={styles.storageItem}>
                <Text style={styles.storageItemCount}>{sizeInfo.labCount}</Text>
                <Text style={styles.storageItemLabel}>Labs</Text>
              </View>
              
              <View style={styles.storageItem}>
                <Text style={styles.storageItemCount}>{sizeInfo.assessmentCount}</Text>
                <Text style={styles.storageItemLabel}>Assessments</Text>
              </View>
            </View>
            
            {offlineData?.lastSynced && (
              <Text style={styles.lastSyncedText}>
                Last synced: {new Date(offlineData.lastSynced).toLocaleString()}
              </Text>
            )}
          </Card.Content>
        </Card>
      )}
      
      {/* Content Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'courses' && styles.activeTab
          ]}
          onPress={() => setSelectedTab('courses')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'courses' && styles.activeTabText
            ]}
          >
            Courses
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'lessons' && styles.activeTab
          ]}
          onPress={() => setSelectedTab('lessons')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'lessons' && styles.activeTabText
            ]}
          >
            Lessons
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'labs' && styles.activeTab
          ]}
          onPress={() => setSelectedTab('labs')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'labs' && styles.activeTabText
            ]}
          >
            Labs
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'assessments' && styles.activeTab
          ]}
          onPress={() => setSelectedTab('assessments')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'assessments' && styles.activeTabText
            ]}
          >
            Quizzes
          </Text>
        </TouchableOpacity>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={24} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <FlatList
        data={getContentData()}
        renderItem={getContentRenderer()}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState()}
      />
      
      {/* Clear All Dialog */}
      <Portal>
        <Dialog visible={showClearDialog} onDismiss={() => setShowClearDialog(false)}>
          <Dialog.Title>Clear All Downloads</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to clear all downloaded content? This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDialog(false)}>Cancel</Button>
            <Button onPress={handleClearAllContent} color="#f44336">Clear All</Button>
          </Dialog.Actions>
        </Dialog>
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
  storageCard: {
    margin: 16,
    marginBottom: 8,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  storageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  storageSize: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  storageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storageItem: {
    alignItems: 'center',
  },
  storageItemCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storageItemLabel: {
    fontSize: 12,
    color: '#757575',
  },
  lastSyncedText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 16,
    textAlign: 'right',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2',
  },
  tabText: {
    color: '#757575',
  },
  activeTabText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  contentCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contentMeta: {
    fontSize: 12,
    color: '#757575',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'right',
  },
  listContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default ManageDownloadsScreen;
