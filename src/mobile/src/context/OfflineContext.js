import React, { createContext, useState, useContext, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {
  initializeOfflineContent,
  getOfflineData,
  getOfflineProgress,
  updateOfflineProgress,
  downloadContent,
  removeOfflineContent,
  syncOfflineProgress,
  clearAllOfflineContent,
  getOfflineContentSize,
  getOfflineStorageInfo,
} from '../services/OfflineContentService';
import analytics from '../utils/analytics';
import security from '../utils/security';
import apiClient from '../services/api/apiClient';
import { ENDPOINTS } from '../config/api';

// Create context
const OfflineContext = createContext();

// Custom hook to use the offline context
export const useOffline = () => {
  const context = useContext(OfflineContext);

  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }

  return context;
};

// Provider component
export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [offlineData, setOfflineData] = useState(null);
  const [offlineProgress, setOfflineProgress] = useState({});
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'success', 'error'
  const [lastSynced, setLastSynced] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [autoDownload, setAutoDownload] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [storageInfo, setStorageInfo] = useState({
    totalSize: 0,
    courseCount: 0,
    lessonCount: 0,
    labCount: 0,
    assessmentCount: 0,
    availableStorage: 0,
  });
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Initialize offline content
  useEffect(() => {
    const initialize = async () => {
      try {
        // Track offline initialization
        analytics.trackEvent('offline_initialization_start', {
          deviceModel: DeviceInfo.getModel(),
          deviceOS: Platform.OS,
          deviceOSVersion: Platform.Version,
        });

        await initializeOfflineContent();

        // Load offline data
        const data = await getOfflineData();
        setOfflineData(data);

        // Load offline progress
        const progress = await getOfflineProgress();
        setOfflineProgress(progress);

        // Set last synced time
        if (data?.lastSynced) {
          setLastSynced(new Date(data.lastSynced));
        }

        // Load settings from secure storage first, then fall back to AsyncStorage
        let autoDownloadSetting = await security.secureStorage.getItem('offlineDownloadsEnabled', false);
        if (autoDownloadSetting === null) {
          autoDownloadSetting = await AsyncStorage.getItem('offlineDownloadsEnabled');

          // Migrate to secure storage if found
          if (autoDownloadSetting !== null) {
            await security.secureStorage.setItem('offlineDownloadsEnabled', autoDownloadSetting);
            await AsyncStorage.removeItem('offlineDownloadsEnabled');
          }
        }

        if (autoDownloadSetting !== null) {
          setAutoDownload(autoDownloadSetting === 'true');
        }

        let autoSyncSetting = await security.secureStorage.getItem('autoSyncEnabled', false);
        if (autoSyncSetting === null) {
          autoSyncSetting = await AsyncStorage.getItem('autoSyncEnabled');

          // Migrate to secure storage if found
          if (autoSyncSetting !== null) {
            await security.secureStorage.setItem('autoSyncEnabled', autoSyncSetting);
            await AsyncStorage.removeItem('autoSyncEnabled');
          }
        }

        if (autoSyncSetting !== null) {
          setAutoSync(autoSyncSetting === 'true');
        }

        // Get storage information
        const storageData = await getOfflineStorageInfo();
        setStorageInfo(storageData);

        // Track successful initialization
        analytics.trackEvent('offline_initialization_complete', {
          contentCount: data ?
            (data.courses?.length || 0) +
            (data.lessons?.length || 0) +
            (data.labs?.length || 0) +
            (data.assessments?.length || 0) : 0,
          storageUsed: storageData.totalSize,
          lastSynced: data?.lastSynced || null,
        });

        setIsInitializing(false);
      } catch (error) {
        console.error('Error initializing offline content:', error);

        // Track initialization error
        analytics.logError(error, 'Offline Initialization');
        analytics.trackEvent('offline_initialization_error', {
          error: error.message,
        });

        setIsInitializing(false);
      }
    };

    initialize();
  }, []);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      const previousOnlineState = isOnline;

      // If we're coming back online and auto-sync is enabled, sync changes
      if (online && !previousOnlineState) {
        // Track network state change
        analytics.trackEvent('offline_network_state_change', {
          state: 'online',
          connectionType: state.type,
          isWifi: state.type === 'wifi',
          isCellular: state.type === 'cellular',
        });

        if (autoSync && pendingChanges > 0) {
          syncChanges();
        }

        // Process download queue if we have pending downloads
        if (downloadQueue.length > 0) {
          processDownloadQueue();
        }
      } else if (!online && previousOnlineState) {
        // Track going offline
        analytics.trackEvent('offline_network_state_change', {
          state: 'offline',
          previousConnectionType: state.type,
        });
      }

      setIsOnline(online);
    });

    // Initial check
    NetInfo.fetch().then(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online);

      // Track initial network state
      analytics.trackEvent('offline_initial_network_state', {
        isOnline: online,
        connectionType: state.type,
        isWifi: state.type === 'wifi',
        isCellular: state.type === 'cellular',
      });
    });

    return () => unsubscribe();
  }, [isOnline, autoSync, pendingChanges, downloadQueue]);

  // Count pending changes
  useEffect(() => {
    const countPendingChanges = () => {
      let count = 0;

      // Count progress updates
      for (const key in offlineProgress) {
        if (key.includes('_completed') || key.includes('_progress')) {
          count++;
        }
      }

      setPendingChanges(count);
    };

    countPendingChanges();
  }, [offlineProgress]);

  // Update offline progress
  const updateProgressOffline = async (progress) => {
    try {
      await updateOfflineProgress(progress);

      // Update local state
      const updatedProgress = await getOfflineProgress();
      setOfflineProgress(updatedProgress);

      // Try to sync if online and auto-sync is enabled
      if (isOnline && autoSync && Object.keys(progress).length > 0) {
        syncChanges();
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating offline progress:', error);
      return { success: false, error };
    }
  };

  // Process download queue
  const processDownloadQueue = async () => {
    if (!isOnline || isDownloading || downloadQueue.length === 0) {
      return;
    }

    try {
      setIsDownloading(true);

      // Track download queue processing
      analytics.trackEvent('offline_download_queue_start', {
        queueLength: downloadQueue.length,
      });

      // Process each item in the queue
      while (downloadQueue.length > 0) {
        // Check if we're still online
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected || !netInfo.isInternetReachable) {
          // We're offline, stop processing
          setIsOnline(false);
          break;
        }

        // Get the next item from the queue
        const nextItem = downloadQueue[0];
        setDownloadProgress(0);

        // Track download start
        analytics.trackEvent('offline_content_download_start', {
          contentType: nextItem.contentType,
          contentId: nextItem.contentId,
          includeRelated: nextItem.includeRelated,
        });

        try {
          // Download the content
          const result = await downloadContent(
            nextItem.contentType,
            nextItem.contentId,
            nextItem.includeRelated,
            (progress) => {
              setDownloadProgress(progress);
            }
          );

          if (result.success) {
            // Update offline data
            const data = await getOfflineData();
            setOfflineData(data);

            // Update storage info
            const storageData = await getOfflineStorageInfo();
            setStorageInfo(storageData);

            // Update last synced time
            if (data?.lastSynced) {
              setLastSynced(new Date(data.lastSynced));
            }

            // Track successful download
            analytics.trackEvent('offline_content_download_success', {
              contentType: nextItem.contentType,
              contentId: nextItem.contentId,
              size: result.size || 0,
              relatedContentCount: result.relatedContentCount || 0,
            });

            // Call the success callback if provided
            if (nextItem.onSuccess) {
              nextItem.onSuccess(result);
            }
          } else {
            // Track failed download
            analytics.trackEvent('offline_content_download_failure', {
              contentType: nextItem.contentType,
              contentId: nextItem.contentId,
              error: result.message,
            });

            // Call the error callback if provided
            if (nextItem.onError) {
              nextItem.onError(result);
            }
          }
        } catch (error) {
          console.error(`Error downloading ${nextItem.contentType}:`, error);

          // Track download error
          analytics.logError(error, 'Offline Content Download');
          analytics.trackEvent('offline_content_download_error', {
            contentType: nextItem.contentType,
            contentId: nextItem.contentId,
            error: error.message,
          });

          // Call the error callback if provided
          if (nextItem.onError) {
            nextItem.onError({
              success: false,
              message: `Failed to download ${nextItem.contentType}`
            });
          }
        }

        // Remove the processed item from the queue
        setDownloadQueue(prevQueue => prevQueue.slice(1));
      }

      // Track download queue completion
      analytics.trackEvent('offline_download_queue_complete');
    } catch (error) {
      console.error('Error processing download queue:', error);
      analytics.logError(error, 'Offline Download Queue');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  // Add content to download queue
  const queueDownloadContent = (contentType, contentId, includeRelated = true, onSuccess, onError) => {
    // Add to queue
    setDownloadQueue(prevQueue => [
      ...prevQueue,
      { contentType, contentId, includeRelated, onSuccess, onError }
    ]);

    // Track queue addition
    analytics.trackEvent('offline_content_queued', {
      contentType,
      contentId,
      queueLength: downloadQueue.length + 1,
    });

    // Start processing if not already downloading and online
    if (!isDownloading && isOnline) {
      processDownloadQueue();
    }

    return {
      success: true,
      message: `${contentType} added to download queue`,
      queuePosition: downloadQueue.length,
    };
  };

  // Download content for offline use
  const handleDownloadContent = async (contentType, contentId, includeRelated = true) => {
    try {
      if (!isOnline) {
        return { success: false, message: 'You are offline. Cannot download content.' };
      }

      // Check if already in download queue
      const alreadyQueued = downloadQueue.some(
        item => item.contentType === contentType && item.contentId === contentId
      );

      if (alreadyQueued) {
        return { success: true, message: `${contentType} is already queued for download` };
      }

      // Check if already downloaded
      if (isContentAvailableOffline(contentType, contentId)) {
        return { success: true, message: `${contentType} is already available offline` };
      }

      // Check available storage
      const storageData = await getOfflineStorageInfo();
      if (storageData.availableStorage < 10 * 1024 * 1024) { // Less than 10MB available
        return {
          success: false,
          message: 'Not enough storage space available. Please free up space and try again.'
        };
      }

      // Track download attempt
      analytics.trackEvent('offline_content_download_attempt', {
        contentType,
        contentId,
        includeRelated,
      });

      // If already downloading something, add to queue
      if (isDownloading) {
        return queueDownloadContent(contentType, contentId, includeRelated);
      }

      setIsDownloading(true);
      setDownloadProgress(0);

      const result = await downloadContent(
        contentType,
        contentId,
        includeRelated,
        (progress) => {
          setDownloadProgress(progress);
        }
      );

      if (result.success) {
        // Update offline data
        const data = await getOfflineData();
        setOfflineData(data);

        // Update storage info
        const updatedStorageData = await getOfflineStorageInfo();
        setStorageInfo(updatedStorageData);

        // Update last synced time
        if (data?.lastSynced) {
          setLastSynced(new Date(data.lastSynced));
        }

        // Track successful download
        analytics.trackEvent('offline_content_download_success', {
          contentType,
          contentId,
          size: result.size || 0,
          relatedContentCount: result.relatedContentCount || 0,
        });
      } else {
        // Track failed download
        analytics.trackEvent('offline_content_download_failure', {
          contentType,
          contentId,
          error: result.message,
        });
      }

      return result;
    } catch (error) {
      console.error(`Error downloading ${contentType}:`, error);

      // Track download error
      analytics.logError(error, 'Offline Content Download');
      analytics.trackEvent('offline_content_download_error', {
        contentType,
        contentId,
        error: error.message,
      });

      return { success: false, message: `Failed to download ${contentType}` };
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  // Remove offline content
  const handleRemoveOfflineContent = async (contentType, contentId, removeRelated = false) => {
    try {
      // Track removal attempt
      analytics.trackEvent('offline_content_remove_attempt', {
        contentType,
        contentId,
        removeRelated,
      });

      // Check if content is in download queue
      const queueIndex = downloadQueue.findIndex(
        item => item.contentType === contentType && item.contentId === contentId
      );

      // If in queue, remove from queue instead of storage
      if (queueIndex !== -1) {
        setDownloadQueue(prevQueue => {
          const newQueue = [...prevQueue];
          newQueue.splice(queueIndex, 1);
          return newQueue;
        });

        // Track queue removal
        analytics.trackEvent('offline_content_queue_removed', {
          contentType,
          contentId,
        });

        return {
          success: true,
          message: `${contentType} removed from download queue`
        };
      }

      // Check if content exists offline
      if (!isContentAvailableOffline(contentType, contentId)) {
        return {
          success: false,
          message: `${contentType} is not available offline`
        };
      }

      const result = await removeOfflineContent(contentType, contentId, removeRelated);

      if (result.success) {
        // Update offline data
        const data = await getOfflineData();
        setOfflineData(data);

        // Update storage info
        const storageData = await getOfflineStorageInfo();
        setStorageInfo(storageData);

        // Track successful removal
        analytics.trackEvent('offline_content_remove_success', {
          contentType,
          contentId,
          freedSpace: result.freedSpace || 0,
          relatedContentRemoved: result.relatedContentRemoved || 0,
        });
      } else {
        // Track failed removal
        analytics.trackEvent('offline_content_remove_failure', {
          contentType,
          contentId,
          error: result.message,
        });
      }

      return result;
    } catch (error) {
      console.error(`Error removing ${contentType}:`, error);

      // Track removal error
      analytics.logError(error, 'Offline Content Removal');
      analytics.trackEvent('offline_content_remove_error', {
        contentType,
        contentId,
        error: error.message,
      });

      return { success: false, message: `Failed to remove ${contentType}` };
    }
  };

  // Sync offline changes with server
  const syncChanges = async (showAlert = false) => {
    if (!isOnline) {
      if (showAlert) {
        Alert.alert('Offline', 'You are offline. Cannot sync changes.');
      }
      return { success: false, message: 'You are offline. Cannot sync changes.' };
    }

    if (pendingChanges === 0) {
      if (showAlert) {
        Alert.alert('No Changes', 'There are no pending changes to sync.');
      }
      return { success: true, message: 'No changes to sync' };
    }

    try {
      setSyncStatus('syncing');

      const result = await syncOfflineProgress();

      if (result.success) {
        // Update offline progress
        const progress = await getOfflineProgress();
        setOfflineProgress(progress);

        // Update last synced time
        const now = new Date();
        setLastSynced(now);

        // Update offline data
        const data = await getOfflineData();
        if (data) {
          data.lastSynced = now.toISOString();
          await AsyncStorage.setItem('offlineData', JSON.stringify(data));
          setOfflineData(data);
        }

        setSyncStatus('success');

        if (showAlert) {
          Alert.alert('Success', 'Changes synced successfully.');
        }
      } else {
        setSyncStatus('error');

        if (showAlert) {
          Alert.alert('Error', result.message || 'Failed to sync changes.');
        }
      }

      return result;
    } catch (error) {
      console.error('Error syncing changes:', error);
      setSyncStatus('error');

      if (showAlert) {
        Alert.alert('Error', 'Failed to sync changes. Please try again.');
      }

      return { success: false, message: 'Failed to sync changes' };
    }
  };

  // Clear all offline content
  const handleClearAllOfflineContent = async () => {
    try {
      const result = await clearAllOfflineContent();

      if (result.success) {
        // Update offline data
        setOfflineData({
          courses: [],
          lessons: [],
          labs: [],
          assessments: [],
          lastSynced: null,
        });

        // Update offline progress
        setOfflineProgress({});

        // Reset last synced time
        setLastSynced(null);
      }

      return result;
    } catch (error) {
      console.error('Error clearing offline content:', error);
      return { success: false, message: 'Failed to clear offline content' };
    }
  };

  // Toggle auto download
  const toggleAutoDownload = async (value) => {
    try {
      setAutoDownload(value);
      await AsyncStorage.setItem('offlineDownloadsEnabled', value.toString());
      return { success: true };
    } catch (error) {
      console.error('Error toggling auto download:', error);
      return { success: false, message: 'Failed to toggle auto download' };
    }
  };

  // Toggle auto sync
  const toggleAutoSync = async (value) => {
    try {
      setAutoSync(value);
      await AsyncStorage.setItem('autoSyncEnabled', value.toString());

      // If enabling auto sync and we're online, sync changes
      if (value && isOnline && pendingChanges > 0) {
        syncChanges();
      }

      return { success: true };
    } catch (error) {
      console.error('Error toggling auto sync:', error);
      return { success: false, message: 'Failed to toggle auto sync' };
    }
  };

  // Check if content is available offline
  const isContentAvailableOffline = (contentType, contentId) => {
    if (!offlineData) return false;

    switch (contentType) {
      case 'course':
        return offlineData.courses?.some(c => c.id === contentId) || false;
      case 'lesson':
        return offlineData.lessons?.some(l => l.id === contentId) || false;
      case 'lab':
        return offlineData.labs?.some(l => l.id === contentId) || false;
      case 'assessment':
        return offlineData.assessments?.some(a => a.id === contentId) || false;
      default:
        return false;
    }
  };

  // Get offline content
  const getOfflineContent = (contentType, contentId) => {
    if (!offlineData) return null;

    switch (contentType) {
      case 'course':
        return offlineData.courses?.find(c => c.id === contentId) || null;
      case 'lesson':
        return offlineData.lessons?.find(l => l.id === contentId) || null;
      case 'lab':
        return offlineData.labs?.find(l => l.id === contentId) || null;
      case 'assessment':
        return offlineData.assessments?.find(a => a.id === contentId) || null;
      default:
        return null;
    }
  };

  // Get storage info
  const getStorageInfo = async () => {
    try {
      const storageData = await getOfflineStorageInfo();
      setStorageInfo(storageData);
      return storageData;
    } catch (error) {
      console.error('Error getting storage info:', error);
      analytics.logError(error, 'Offline Storage Info');
      return storageInfo;
    }
  };

  // Cancel all downloads
  const cancelAllDownloads = () => {
    if (downloadQueue.length === 0 && !isDownloading) {
      return { success: false, message: 'No active downloads to cancel' };
    }

    // Track cancellation
    analytics.trackEvent('offline_downloads_cancelled', {
      queueLength: downloadQueue.length,
      wasDownloading: isDownloading,
    });

    setDownloadQueue([]);
    setIsDownloading(false);
    setDownloadProgress(0);

    return { success: true, message: 'All downloads cancelled' };
  };

  // Cancel specific download
  const cancelDownload = (contentType, contentId) => {
    // Check if content is in download queue
    const queueIndex = downloadQueue.findIndex(
      item => item.contentType === contentType && item.contentId === contentId
    );

    if (queueIndex === -1) {
      return { success: false, message: `${contentType} is not in download queue` };
    }

    // If it's the currently downloading item (index 0), cancel the download
    if (queueIndex === 0 && isDownloading) {
      // We can't actually cancel the current download, but we can remove it from the queue
      // and set isDownloading to false so the next item will be processed
      setDownloadQueue(prevQueue => prevQueue.slice(1));
      setIsDownloading(false);
      setDownloadProgress(0);
    } else {
      // Remove from queue
      setDownloadQueue(prevQueue => {
        const newQueue = [...prevQueue];
        newQueue.splice(queueIndex, 1);
        return newQueue;
      });
    }

    // Track cancellation
    analytics.trackEvent('offline_download_cancelled', {
      contentType,
      contentId,
      queuePosition: queueIndex,
    });

    return { success: true, message: `${contentType} download cancelled` };
  };

  // Context value
  const value = {
    isOnline,
    isInitializing,
    offlineData,
    offlineProgress,
    syncStatus,
    lastSynced,
    pendingChanges,
    autoDownload,
    autoSync,
    storageInfo,
    isDownloading,
    downloadProgress,
    downloadQueue: downloadQueue.map(item => ({
      contentType: item.contentType,
      contentId: item.contentId
    })),
    updateProgressOffline,
    downloadContent: handleDownloadContent,
    queueDownloadContent,
    removeOfflineContent: handleRemoveOfflineContent,
    syncChanges,
    clearAllOfflineContent: handleClearAllOfflineContent,
    toggleAutoDownload,
    toggleAutoSync,
    isContentAvailableOffline,
    getOfflineContent,
    getStorageInfo,
    cancelAllDownloads,
    cancelDownload,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};
