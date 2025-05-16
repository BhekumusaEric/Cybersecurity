/**
 * Offline Content Screen
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OfflineContentScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const {
    offlineData,
    isInitializing,
    storageInfo,
    downloadQueue,
    isDownloading,
    downloadProgress,
    removeOfflineContent,
    cancelDownload,
    cancelAllDownloads,
    getStorageInfo,
    clearAllOfflineContent,
    lastSynced,
    syncChanges,
    syncStatus,
  } = useOffline();
  
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'labs', 'lessons'
  
  useEffect(() => {
    // Refresh storage info when the screen is focused
    const refreshStorageInfo = async () => {
      await getStorageInfo();
    };
    
    refreshStorageInfo();
  }, [getStorageInfo]);
  
  const handleRemoveContent = async (contentType, contentId) => {
    Alert.alert(
      'Remove Content',
      `Are you sure you want to remove this ${contentType} from offline content?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              const result = await removeOfflineContent(contentType, contentId);
              if (result.success) {
                Alert.alert('Success', `${contentType} removed from offline content`);
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              console.error(`Error removing ${contentType}:`, error);
              Alert.alert('Error', `Failed to remove ${contentType}`);
            }
          },
        },
      ]
    );
  };
  
  const handleCancelDownload = (contentType, contentId) => {
    Alert.alert(
      'Cancel Download',
      `Are you sure you want to cancel the download of this ${contentType}?`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            const result = cancelDownload(contentType, contentId);
            if (result.success) {
              Alert.alert('Success', `${contentType} download cancelled`);
            } else {
              Alert.alert('Error', result.message);
            }
          },
        },
      ]
    );
  };
  
  const handleCancelAllDownloads = () => {
    Alert.alert(
      'Cancel All Downloads',
      'Are you sure you want to cancel all downloads?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            const result = cancelAllDownloads();
            if (result.success) {
              Alert.alert('Success', 'All downloads cancelled');
            } else {
              Alert.alert('Error', result.message);
            }
          },
        },
      ]
    );
  };
  
  const handleClearAllContent = () => {
    Alert.alert(
      'Clear All Offline Content',
      'Are you sure you want to remove all offline content? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await clearAllOfflineContent();
              if (result.success) {
                Alert.alert('Success', 'All offline content cleared');
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              console.error('Error clearing offline content:', error);
              Alert.alert('Error', 'Failed to clear offline content');
            }
          },
        },
      ]
    );
  };
  
  const handleSyncNow = async () => {
    if (syncStatus === 'syncing') {
      Alert.alert('Sync in Progress', 'Please wait for the current sync to complete');
      return;
    }
    
    try {
      const result = await syncChanges();
      if (result.success) {
        Alert.alert('Success', 'Sync completed successfully');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error syncing changes:', error);
      Alert.alert('Error', 'Failed to sync changes');
    }
  };
  
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    storageInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    storageInfoItem: {
      alignItems: 'center',
    },
    storageInfoValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    storageInfoLabel: {
      fontSize: 12,
      color: colors.text + '99',
    },
    progressContainer: {
      marginBottom: 16,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    progressTitle: {
      fontSize: 14,
      color: colors.text,
    },
    progressValue: {
      fontSize: 14,
      color: colors.primary,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
      backgroundColor: colors.primary,
    },
    syncInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    syncText: {
      fontSize: 14,
      color: colors.text,
    },
    syncButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    syncButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      marginLeft: 4,
    },
    tabs: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
    },
    tabIndicator: {
      height: 3,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      marginTop: 8,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
      marginLeft: 12,
    },
    cardContent: {
      padding: 16,
    },
    cardDescription: {
      fontSize: 14,
      color: colors.text + '99',
      marginBottom: 12,
    },
    cardMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    cardMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardMetaText: {
      fontSize: 12,
      color: colors.text + '99',
      marginLeft: 4,
    },
    cardActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    cardButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      backgroundColor: colors.error + '20',
      marginLeft: 8,
    },
    cardButtonText: {
      color: colors.error,
      fontSize: 12,
      marginLeft: 4,
    },
    downloadItem: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    downloadHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    downloadTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
      marginLeft: 12,
    },
    downloadProgressContainer: {
      marginBottom: 12,
    },
    downloadProgressBar: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
    },
    downloadProgressFill: {
      height: '100%',
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    downloadProgressText: {
      fontSize: 12,
      color: colors.text + '99',
      textAlign: 'right',
      marginTop: 4,
    },
    downloadActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    downloadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      backgroundColor: colors.error + '20',
    },
    downloadButtonText: {
      color: colors.error,
      fontSize: 12,
      marginLeft: 4,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 16,
      color: colors.text + '99',
      textAlign: 'center',
      marginBottom: 24,
    },
    emptyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    emptyButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      marginLeft: 8,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.error + '20',
    },
    clearButtonText: {
      color: colors.error,
      fontSize: 16,
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

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16, color: colors.text }}>Loading offline content...</Text>
      </View>
    );
  }

  const renderCourseItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="book-open-variant" size={24} color={colors.primary} />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.cardMetaItem}>
            <Icon name="clock-outline" size={16} color={colors.text + '99'} />
            <Text style={styles.cardMetaText}>{item.duration}</Text>
          </View>
          <View style={styles.cardMetaItem}>
            <Icon name="database" size={16} color={colors.text + '99'} />
            <Text style={styles.cardMetaText}>{formatBytes(item.size || 0)}</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => handleRemoveContent('course', item.id)}
          >
            <Icon name="delete" size={16} color={colors.error} />
            <Text style={styles.cardButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderLabItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="flask" size={24} color={colors.primary} />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.cardMetaItem}>
            <Icon name="clock-outline" size={16} color={colors.text + '99'} />
            <Text style={styles.cardMetaText}>{item.duration}</Text>
          </View>
          <View style={styles.cardMetaItem}>
            <Icon name="database" size={16} color={colors.text + '99'} />
            <Text style={styles.cardMetaText}>{formatBytes(item.size || 0)}</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => handleRemoveContent('lab', item.id)}
          >
            <Icon name="delete" size={16} color={colors.error} />
            <Text style={styles.cardButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderLessonItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="file-document" size={24} color={colors.primary} />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardMeta}>
          <View style={styles.cardMetaItem}>
            <Icon name="clock-outline" size={16} color={colors.text + '99'} />
            <Text style={styles.cardMetaText}>{item.duration}</Text>
          </View>
          <View style={styles.cardMetaItem}>
            <Icon name="database" size={16} color={colors.text + '99'} />
            <Text style={styles.cardMetaText}>{formatBytes(item.size || 0)}</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => handleRemoveContent('lesson', item.id)}
          >
            <Icon name="delete" size={16} color={colors.error} />
            <Text style={styles.cardButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderDownloadItem = ({ item }) => (
    <View style={styles.downloadItem}>
      <View style={styles.downloadHeader}>
        <Icon
          name={
            item.contentType === 'course'
              ? 'book-open-variant'
              : item.contentType === 'lab'
              ? 'flask'
              : 'file-document'
          }
          size={24}
          color={colors.primary}
        />
        <Text style={styles.downloadTitle}>
          {item.contentType.charAt(0).toUpperCase() + item.contentType.slice(1)} Download
        </Text>
      </View>
      
      {item.contentId === downloadQueue[0]?.contentId && isDownloading ? (
        <>
          <View style={styles.downloadProgressContainer}>
            <View style={styles.downloadProgressBar}>
              <View
                style={[
                  styles.downloadProgressFill,
                  { width: `${downloadProgress * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.downloadProgressText}>
              {Math.round(downloadProgress * 100)}% complete
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.cardMetaText}>Queued for download</Text>
      )}
      
      <View style={styles.downloadActions}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleCancelDownload(item.contentType, item.contentId)}
        >
          <Icon name="close" size={16} color={colors.error} />
          <Text style={styles.downloadButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyContent = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name={
          activeTab === 'courses'
            ? 'book-open-variant'
            : activeTab === 'labs'
            ? 'flask'
            : 'file-document'
        }
        size={64}
        color={colors.text + '30'}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>
        No offline {activeTab} available. Download {activeTab} to access them offline.
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => {
          if (activeTab === 'courses') {
            navigation.navigate('Courses');
          } else if (activeTab === 'labs') {
            navigation.navigate('Labs');
          } else {
            navigation.navigate('Courses');
          }
        }}
      >
        <Icon name="download" size={16} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>
          Browse {activeTab === 'courses' ? 'Courses' : activeTab === 'labs' ? 'Labs' : 'Lessons'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyDownloads = () => (
    <View style={styles.emptyContainer}>
      <Icon name="download" size={64} color={colors.text + '30'} style={styles.emptyIcon} />
      <Text style={styles.emptyText}>No downloads in progress</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.storageInfo}>
          <View style={styles.storageInfoItem}>
            <Text style={styles.storageInfoValue}>{formatBytes(storageInfo.totalSize)}</Text>
            <Text style={styles.storageInfoLabel}>Total Size</Text>
          </View>
          <View style={styles.storageInfoItem}>
            <Text style={styles.storageInfoValue}>{storageInfo.courseCount}</Text>
            <Text style={styles.storageInfoLabel}>Courses</Text>
          </View>
          <View style={styles.storageInfoItem}>
            <Text style={styles.storageInfoValue}>{storageInfo.labCount}</Text>
            <Text style={styles.storageInfoLabel}>Labs</Text>
          </View>
          <View style={styles.storageInfoItem}>
            <Text style={styles.storageInfoValue}>{storageInfo.lessonCount}</Text>
            <Text style={styles.storageInfoLabel}>Lessons</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Storage Used</Text>
            <Text style={styles.progressValue}>
              {formatBytes(storageInfo.totalSize)} / {formatBytes(storageInfo.totalDeviceStorage)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (storageInfo.totalSize / storageInfo.totalDeviceStorage) * 100
                  }%`,
                },
              ]}
            />
          </View>
        </View>
        
        <View style={styles.syncInfo}>
          <Text style={styles.syncText}>
            Last synced: {formatDate(lastSynced)}
          </Text>
          <TouchableOpacity
            style={[
              styles.syncButton,
              syncStatus === 'syncing' && { opacity: 0.7 },
            ]}
            onPress={handleSyncNow}
            disabled={syncStatus === 'syncing'}
          >
            {syncStatus === 'syncing' ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Icon name="sync" size={16} color="#FFFFFF" />
                <Text style={styles.syncButtonText}>Sync Now</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('courses')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'courses' ? colors.primary : colors.text + '99',
              },
            ]}
          >
            Courses
          </Text>
          <View
            style={[
              styles.tabIndicator,
              {
                backgroundColor:
                  activeTab === 'courses' ? colors.primary : 'transparent',
                width: activeTab === 'courses' ? 20 : 0,
              },
            ]}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('labs')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'labs' ? colors.primary : colors.text + '99',
              },
            ]}
          >
            Labs
          </Text>
          <View
            style={[
              styles.tabIndicator,
              {
                backgroundColor:
                  activeTab === 'labs' ? colors.primary : 'transparent',
                width: activeTab === 'labs' ? 20 : 0,
              },
            ]}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('lessons')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'lessons' ? colors.primary : colors.text + '99',
              },
            ]}
          >
            Lessons
          </Text>
          <View
            style={[
              styles.tabIndicator,
              {
                backgroundColor:
                  activeTab === 'lessons' ? colors.primary : 'transparent',
                width: activeTab === 'lessons' ? 20 : 0,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {downloadQueue.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Downloads ({downloadQueue.length})</Text>
            <FlatList
              data={downloadQueue}
              renderItem={renderDownloadItem}
              keyExtractor={(item, index) => `${item.contentType}-${item.contentId}-${index}`}
              ListEmptyComponent={renderEmptyDownloads}
              style={{ marginBottom: 16 }}
            />
            
            {downloadQueue.length > 1 && (
              <TouchableOpacity
                style={[
                  styles.clearButton,
                  {
                    backgroundColor: colors.error + '20',
                    marginBottom: 24,
                  },
                ]}
                onPress={handleCancelAllDownloads}
              >
                <Icon name="close-circle" size={20} color={colors.error} />
                <Text style={styles.clearButtonText}>Cancel All Downloads</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        
        <Text style={styles.sectionTitle}>
          Offline {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Text>
        
        {activeTab === 'courses' && (
          <FlatList
            data={offlineData?.courses || []}
            renderItem={renderCourseItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyContent}
          />
        )}
        
        {activeTab === 'labs' && (
          <FlatList
            data={offlineData?.labs || []}
            renderItem={renderLabItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyContent}
          />
        )}
        
        {activeTab === 'lessons' && (
          <FlatList
            data={offlineData?.lessons || []}
            renderItem={renderLessonItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyContent}
          />
        )}
      </View>
      
      {(offlineData?.courses?.length > 0 ||
        offlineData?.labs?.length > 0 ||
        offlineData?.lessons?.length > 0) && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAllContent}
          >
            <Icon name="delete" size={20} color={colors.error} />
            <Text style={styles.clearButtonText}>Clear All Offline Content</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OfflineContentScreen;
