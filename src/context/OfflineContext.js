/**
 * Offline Context
 *
 * This context provides offline functionality for the app.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Create context
const OfflineContext = createContext();

// Mock data for offline content
const mockOfflineData = {
  courses: [
    {
      id: '1',
      title: 'Introduction to Ethical Hacking',
      description: 'Learn the basics of ethical hacking and penetration testing',
      image: 'https://via.placeholder.com/150',
      level: 'Beginner',
      duration: '8 weeks',
      progress: 75,
      size: 25600000, // 25.6 MB
    },
    {
      id: '2',
      title: 'Network Security Fundamentals',
      description: 'Master the fundamentals of network security and protection',
      image: 'https://via.placeholder.com/150',
      level: 'Intermediate',
      duration: '10 weeks',
      progress: 30,
      size: 32000000, // 32 MB
    },
  ],
  labs: [
    {
      id: '1',
      title: 'Network Scanning Lab',
      description: 'Learn how to scan networks and identify vulnerabilities',
      difficulty: 'Beginner',
      duration: '2 hours',
      status: 'completed',
      tools: ['Nmap', 'Wireshark'],
      size: 15000000, // 15 MB
    },
  ],
  lessons: [
    {
      id: '1',
      title: 'What is Ethical Hacking?',
      duration: '15 min',
      completed: true,
      size: 5000000, // 5 MB
    },
    {
      id: '2',
      title: 'Legal and Ethical Considerations',
      duration: '20 min',
      completed: true,
      size: 6000000, // 6 MB
    },
  ],
};

// Provider component
export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineData, setOfflineData] = useState(null);
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [autoDownload, setAutoDownload] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [storageInfo, setStorageInfo] = useState({
    totalSize: 0,
    totalDeviceStorage: 1000000000, // 1 GB (simulated)
    courseCount: 0,
    labCount: 0,
    lessonCount: 0,
  });
  const [lastSynced, setLastSynced] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'error'

  // Initialize offline data
  useEffect(() => {
    const initOfflineData = async () => {
      try {
        // Check if offline data exists
        const offlineDataString = await AsyncStorage.getItem('offlineData');
        if (offlineDataString) {
          const parsedData = JSON.parse(offlineDataString);
          setOfflineData(parsedData);
        } else {
          // For demo purposes, we'll use mock data
          // In a real app, this would be empty initially
          setOfflineData(mockOfflineData);
          await AsyncStorage.setItem('offlineData', JSON.stringify(mockOfflineData));
        }

        // Get last synced time
        const lastSyncedTime = await AsyncStorage.getItem('lastSynced');
        if (lastSyncedTime) {
          setLastSynced(lastSyncedTime);
        }

        // Get auto download setting
        const autoDownloadSetting = await AsyncStorage.getItem('autoDownload');
        if (autoDownloadSetting !== null) {
          setAutoDownload(autoDownloadSetting === 'true');
        }

        // Get auto sync setting
        const autoSyncSetting = await AsyncStorage.getItem('autoSync');
        if (autoSyncSetting !== null) {
          setAutoSync(autoSyncSetting === 'true');
        }

        // Update storage info
        await updateStorageInfo();
      } catch (error) {
        console.error('Error initializing offline data:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initOfflineData();
  }, []);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected && state.isInternetReachable);

      // If we're back online and auto sync is enabled, sync changes
      if (state.isConnected && state.isInternetReachable && autoSync && syncStatus !== 'syncing') {
        syncChanges();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [autoSync, syncStatus]);

  // Process download queue
  useEffect(() => {
    const processQueue = async () => {
      if (downloadQueue.length > 0 && !isDownloading && isOnline) {
        setIsDownloading(true);
        setDownloadProgress(0);

        const currentDownload = downloadQueue[0];

        try {
          // Simulate download progress
          for (let i = 0; i <= 10; i++) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setDownloadProgress(i / 10);
          }

          // Add to offline data
          await addToOfflineData(
            currentDownload.contentType,
            currentDownload.contentId
          );

          // Remove from queue
          setDownloadQueue((prev) => prev.slice(1));
        } catch (error) {
          console.error('Error processing download queue:', error);
        } finally {
          setIsDownloading(false);
          setDownloadProgress(0);
        }
      }
    };

    processQueue();
  }, [downloadQueue, isDownloading, isOnline]);

  // Update storage info
  const updateStorageInfo = async () => {
    try {
      const offlineDataString = await AsyncStorage.getItem('offlineData');
      if (offlineDataString) {
        const parsedData = JSON.parse(offlineDataString);

        let totalSize = 0;
        let courseCount = 0;
        let labCount = 0;
        let lessonCount = 0;

        if (parsedData.courses) {
          courseCount = parsedData.courses.length;
          totalSize += parsedData.courses.reduce(
            (sum, course) => sum + (course.size || 0),
            0
          );
        }

        if (parsedData.labs) {
          labCount = parsedData.labs.length;
          totalSize += parsedData.labs.reduce(
            (sum, lab) => sum + (lab.size || 0),
            0
          );
        }

        if (parsedData.lessons) {
          lessonCount = parsedData.lessons.length;
          totalSize += parsedData.lessons.reduce(
            (sum, lesson) => sum + (lesson.size || 0),
            0
          );
        }

        setStorageInfo({
          totalSize,
          totalDeviceStorage: 1000000000, // 1 GB (simulated)
          courseCount,
          labCount,
          lessonCount,
        });
      }
    } catch (error) {
      console.error('Error updating storage info:', error);
    }
  };

  // Add content to offline data
  const addToOfflineData = async (contentType, contentId) => {
    try {
      // In a real app, you would download the content from the server
      // For now, we'll simulate adding content to offline data

      // Get current offline data
      const offlineDataString = await AsyncStorage.getItem('offlineData');
      const parsedData = offlineDataString ? JSON.parse(offlineDataString) : {};

      // Initialize content type array if it doesn't exist
      if (!parsedData[contentType]) {
        parsedData[contentType] = [];
      }

      // Check if content already exists
      const existingContent = parsedData[contentType].find(
        (item) => item.id === contentId
      );

      if (existingContent) {
        return { success: true, message: 'Content already available offline' };
      }

      // Simulate fetching content from server
      // In a real app, you would make an API call to get the content
      let newContent;

      switch (contentType) {
        case 'course':
          newContent = {
            id: contentId,
            title: `Course ${contentId}`,
            description: 'Course description',
            image: 'https://via.placeholder.com/150',
            level: 'Intermediate',
            duration: '8 weeks',
            progress: 0,
            size: 30000000, // 30 MB
          };
          break;
        case 'lab':
          newContent = {
            id: contentId,
            title: `Lab ${contentId}`,
            description: 'Lab description',
            difficulty: 'Intermediate',
            duration: '2 hours',
            status: 'notStarted',
            tools: ['Tool 1', 'Tool 2'],
            size: 15000000, // 15 MB
          };
          break;
        case 'lesson':
          newContent = {
            id: contentId,
            title: `Lesson ${contentId}`,
            duration: '20 min',
            completed: false,
            size: 5000000, // 5 MB
          };
          break;
        default:
          throw new Error(`Invalid content type: ${contentType}`);
      }

      // Add content to offline data
      parsedData[contentType].push(newContent);

      // Save updated offline data
      await AsyncStorage.setItem('offlineData', JSON.stringify(parsedData));

      // Update state
      setOfflineData(parsedData);

      // Update storage info
      await updateStorageInfo();

      return { success: true, message: 'Content added to offline data' };
    } catch (error) {
      console.error('Error adding content to offline data:', error);
      return { success: false, message: 'Failed to add content to offline data' };
    }
  };

  // Download content
  const downloadContent = async (contentType, contentId, addToQueue = true) => {
    try {
      // Check if content is already available offline
      if (await isContentAvailableOffline(contentType, contentId)) {
        return { success: true, message: 'Content already available offline' };
      }

      // Check if content is already in the download queue
      const isInQueue = downloadQueue.some(
        (item) =>
          item.contentType === contentType && item.contentId === contentId
      );

      if (isInQueue) {
        return { success: true, message: 'Content already in download queue' };
      }

      if (addToQueue) {
        // Add to download queue
        setDownloadQueue((prev) => [
          ...prev,
          { contentType, contentId },
        ]);

        return { success: true, message: 'Content added to download queue' };
      } else {
        // Download immediately
        return await addToOfflineData(contentType, contentId);
      }
    } catch (error) {
      console.error('Error downloading content:', error);
      return { success: false, message: 'Failed to download content' };
    }
  };

  // Remove content from offline data
  const removeOfflineContent = async (contentType, contentId) => {
    try {
      // Get current offline data
      const offlineDataString = await AsyncStorage.getItem('offlineData');
      if (!offlineDataString) {
        return { success: false, message: 'No offline data found' };
      }

      const parsedData = JSON.parse(offlineDataString);

      // Check if content type exists
      if (!parsedData[contentType]) {
        return { success: false, message: `No ${contentType} found in offline data` };
      }

      // Check if content exists
      const contentIndex = parsedData[contentType].findIndex(
        (item) => item.id === contentId
      );

      if (contentIndex === -1) {
        return { success: false, message: `${contentType} not found in offline data` };
      }

      // Remove content
      parsedData[contentType].splice(contentIndex, 1);

      // Save updated offline data
      await AsyncStorage.setItem('offlineData', JSON.stringify(parsedData));

      // Update state
      setOfflineData(parsedData);

      // Update storage info
      await updateStorageInfo();

      return { success: true, message: `${contentType} removed from offline data` };
    } catch (error) {
      console.error('Error removing content from offline data:', error);
      return { success: false, message: 'Failed to remove content from offline data' };
    }
  };

  // Check if content is available offline
  const isContentAvailableOffline = async (contentType, contentId) => {
    try {
      // Get current offline data
      const offlineDataString = await AsyncStorage.getItem('offlineData');
      if (!offlineDataString) {
        return false;
      }

      const parsedData = JSON.parse(offlineDataString);

      // Check if content type exists
      if (!parsedData[contentType]) {
        return false;
      }

      // Check if content exists
      return parsedData[contentType].some((item) => item.id === contentId);
    } catch (error) {
      console.error('Error checking if content is available offline:', error);
      return false;
    }
  };

  // Cancel download
  const cancelDownload = (contentType, contentId) => {
    try {
      // Check if content is in the download queue
      const contentIndex = downloadQueue.findIndex(
        (item) =>
          item.contentType === contentType && item.contentId === contentId
      );

      if (contentIndex === -1) {
        return { success: false, message: 'Content not found in download queue' };
      }

      // If it's the current download, we can't cancel it
      if (contentIndex === 0 && isDownloading) {
        return { success: false, message: 'Cannot cancel current download' };
      }

      // Remove from download queue
      setDownloadQueue((prev) => {
        const newQueue = [...prev];
        newQueue.splice(contentIndex, 1);
        return newQueue;
      });

      return { success: true, message: 'Download cancelled' };
    } catch (error) {
      console.error('Error cancelling download:', error);
      return { success: false, message: 'Failed to cancel download' };
    }
  };

  // Cancel all downloads
  const cancelAllDownloads = () => {
    try {
      // If there's a current download, we can't cancel it
      if (isDownloading) {
        // Keep the current download, cancel the rest
        setDownloadQueue((prev) => [prev[0]]);
      } else {
        // Cancel all downloads
        setDownloadQueue([]);
      }

      return { success: true, message: 'All downloads cancelled' };
    } catch (error) {
      console.error('Error cancelling all downloads:', error);
      return { success: false, message: 'Failed to cancel all downloads' };
    }
  };

  // Clear all offline content
  const clearAllOfflineContent = async () => {
    try {
      // Clear offline data
      await AsyncStorage.setItem('offlineData', JSON.stringify({
        courses: [],
        labs: [],
        lessons: [],
      }));

      // Update state
      setOfflineData({
        courses: [],
        labs: [],
        lessons: [],
      });

      // Update storage info
      await updateStorageInfo();

      return { success: true, message: 'All offline content cleared' };
    } catch (error) {
      console.error('Error clearing all offline content:', error);
      return { success: false, message: 'Failed to clear all offline content' };
    }
  };

  // Toggle auto download
  const toggleAutoDownload = async (value) => {
    try {
      const newValue = value !== undefined ? value : !autoDownload;
      setAutoDownload(newValue);
      await AsyncStorage.setItem('autoDownload', newValue.toString());
    } catch (error) {
      console.error('Error toggling auto download:', error);
    }
  };

  // Toggle auto sync
  const toggleAutoSync = async (value) => {
    try {
      const newValue = value !== undefined ? value : !autoSync;
      setAutoSync(newValue);
      await AsyncStorage.setItem('autoSync', newValue.toString());
    } catch (error) {
      console.error('Error toggling auto sync:', error);
    }
  };

  // Sync changes
  const syncChanges = async () => {
    try {
      if (!isOnline) {
        return { success: false, message: 'No internet connection' };
      }

      if (syncStatus === 'syncing') {
        return { success: false, message: 'Sync already in progress' };
      }

      setSyncStatus('syncing');

      // Simulate syncing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update last synced time
      const now = new Date().toISOString();
      setLastSynced(now);
      await AsyncStorage.setItem('lastSynced', now);

      setSyncStatus('idle');

      return { success: true, message: 'Sync completed successfully' };
    } catch (error) {
      console.error('Error syncing changes:', error);
      setSyncStatus('error');
      return { success: false, message: 'Failed to sync changes' };
    }
  };

  // Get storage info
  const getStorageInfo = async () => {
    await updateStorageInfo();
    return storageInfo;
  };

  // Toggle offline mode
  const toggleOfflineMode = (value) => {
    const newValue = value !== undefined ? value : !offlineMode;
    setOfflineMode(newValue);
  };

  // Create a safe context value
  const contextValue = {
    isOnline: isOnline || false,
    offlineMode: offlineMode || false,
    offlineData: offlineData || { courses: [], labs: [], lessons: [] },
    downloadQueue: downloadQueue || [],
    isDownloading: isDownloading || false,
    downloadProgress: downloadProgress || {},
    autoDownload: autoDownload || false,
    autoSync: autoSync || false,
    isInitializing: isInitializing || false,
    storageInfo: storageInfo || { totalSize: 0, courseCount: 0, labCount: 0, lessonCount: 0 },
    lastSynced: lastSynced || null,
    syncStatus: syncStatus || 'idle',
    downloadContent: downloadContent || (() => Promise.resolve({ success: false })),
    removeOfflineContent: removeOfflineContent || (() => Promise.resolve({ success: false })),
    isContentAvailableOffline: isContentAvailableOffline || (() => Promise.resolve(false)),
    cancelDownload: cancelDownload || (() => ({ success: false })),
    cancelAllDownloads: cancelAllDownloads || (() => ({ success: false })),
    clearAllOfflineContent: clearAllOfflineContent || (() => Promise.resolve({ success: false })),
    toggleAutoDownload: toggleAutoDownload || (() => {}),
    toggleAutoSync: toggleAutoSync || (() => {}),
    syncChanges: syncChanges || (() => Promise.resolve({ success: false })),
    getStorageInfo: getStorageInfo || (() => Promise.resolve({})),
    toggleOfflineMode: toggleOfflineMode || (() => {}),
  };

  return (
    <OfflineContext.Provider value={contextValue}>
      {children}
    </OfflineContext.Provider>
  );
};

// Custom hook
export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export default OfflineContext;
