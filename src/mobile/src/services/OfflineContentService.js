import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import * as FileSystem from 'react-native-fs';
import { fetchCourseDetails } from './api/courseService';
import { fetchLabDetails } from './api/labService';
import { fetchAssessmentDetails } from './api/assessmentService';
import { fetchLessonDetails } from './api/courseService';

// Constants
const OFFLINE_DATA_KEY = 'offlineData';
const OFFLINE_PROGRESS_KEY = 'offlineProgress';
const OFFLINE_CONTENT_DIR = `${FileSystem.DocumentDirectoryPath}/offline_content`;

/**
 * Initialize offline content directory
 * @returns {Promise<void>}
 */
export const initializeOfflineContent = async () => {
  try {
    // Check if directory exists
    const dirExists = await FileSystem.exists(OFFLINE_CONTENT_DIR);

    if (!dirExists) {
      await FileSystem.mkdir(OFFLINE_CONTENT_DIR);
    }

    // Initialize offline data if not exists
    const offlineData = await AsyncStorage.getItem(OFFLINE_DATA_KEY);

    if (!offlineData) {
      const initialData = {
        courses: [],
        lessons: [],
        labs: [],
        assessments: [],
        lastSynced: null,
      };

      await AsyncStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(initialData));
    }

    // Initialize offline progress if not exists
    const offlineProgress = await AsyncStorage.getItem(OFFLINE_PROGRESS_KEY);

    if (!offlineProgress) {
      await AsyncStorage.setItem(OFFLINE_PROGRESS_KEY, JSON.stringify({}));
    }
  } catch (error) {
    console.error('Error initializing offline content:', error);
    throw error;
  }
};

/**
 * Get offline data
 * @returns {Promise<Object>} Offline data
 */
export const getOfflineData = async () => {
  try {
    const offlineData = await AsyncStorage.getItem(OFFLINE_DATA_KEY);
    return offlineData ? JSON.parse(offlineData) : null;
  } catch (error) {
    console.error('Error getting offline data:', error);
    throw error;
  }
};

/**
 * Get offline progress
 * @returns {Promise<Object>} Offline progress
 */
export const getOfflineProgress = async () => {
  try {
    const offlineProgress = await AsyncStorage.getItem(OFFLINE_PROGRESS_KEY);
    return offlineProgress ? JSON.parse(offlineProgress) : {};
  } catch (error) {
    console.error('Error getting offline progress:', error);
    throw error;
  }
};

/**
 * Update offline progress
 * @param {Object} progress - Progress data to update
 * @returns {Promise<void>}
 */
export const updateOfflineProgress = async (progress) => {
  try {
    // Get current progress
    const currentProgress = await getOfflineProgress();

    // Merge with new progress
    const updatedProgress = {
      ...currentProgress,
      ...progress,
      lastUpdated: new Date().toISOString(),
    };

    // Save updated progress
    await AsyncStorage.setItem(OFFLINE_PROGRESS_KEY, JSON.stringify(updatedProgress));
  } catch (error) {
    console.error('Error updating offline progress:', error);
    throw error;
  }
};

/**
 * Download content for offline use
 * @param {string} contentType - Type of content ('course', 'lesson', 'lab', 'assessment')
 * @param {string|number} contentId - ID of the content
 * @param {boolean} includeRelated - Whether to include related content (e.g., lessons for a course)
 * @param {Function} progressCallback - Callback function for download progress (0-1)
 * @returns {Promise<Object>} Result of the download operation
 */
export const downloadContent = async (contentType, contentId, includeRelated = true, progressCallback = null) => {
  try {
    // Check network connectivity
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      return { success: false, message: 'No internet connection' };
    }

    // Get current offline data
    const offlineData = await getOfflineData();

    // Fetch content based on type
    let content;
    let relatedContent = [];

    switch (contentType) {
      case 'course':
        content = await fetchCourseDetails(contentId);

        // Download course image
        if (content.image) {
          await downloadFile(content.image, `course_${contentId}_image`, progressCallback);
        }

        // Download related lessons if includeRelated is true
        if (includeRelated && content.modules) {
          for (const module of content.modules) {
            for (const lesson of module.lessons) {
              try {
                const lessonDetails = await fetchLessonDetails(lesson.id);
                relatedContent.push(lessonDetails);

                // Download lesson resources
                if (lessonDetails.sections) {
                  for (const section of lessonDetails.sections) {
                    if (section.videoUrl) {
                      await downloadFile(section.videoUrl, `lesson_${lesson.id}_video_${section.id}`, progressCallback);
                    }
                  }
                }
              } catch (error) {
                console.error(`Error downloading lesson ${lesson.id}:`, error);
              }
            }
          }
        }
        break;

      case 'lesson':
        content = await fetchLessonDetails(contentId);

        // Download lesson resources
        if (content.sections) {
          for (const section of content.sections) {
            if (section.videoUrl) {
              await downloadFile(section.videoUrl, `lesson_${contentId}_video_${section.id}`, progressCallback);
            }
          }
        }
        break;

      case 'lab':
        content = await fetchLabDetails(contentId);

        // Download lab resources
        if (content.image) {
          await downloadFile(content.image, `lab_${contentId}_image`, progressCallback);
        }
        break;

      case 'assessment':
        content = await fetchAssessmentDetails(contentId);
        break;

      default:
        return { success: false, message: 'Invalid content type' };
    }

    // Update offline data
    const updatedOfflineData = { ...offlineData };

    // Add main content
    switch (contentType) {
      case 'course':
        updatedOfflineData.courses = [
          ...updatedOfflineData.courses.filter(c => c.id !== contentId),
          content,
        ];
        break;

      case 'lesson':
        updatedOfflineData.lessons = [
          ...updatedOfflineData.lessons.filter(l => l.id !== contentId),
          content,
        ];
        break;

      case 'lab':
        updatedOfflineData.labs = [
          ...updatedOfflineData.labs.filter(l => l.id !== contentId),
          content,
        ];
        break;

      case 'assessment':
        updatedOfflineData.assessments = [
          ...updatedOfflineData.assessments.filter(a => a.id !== contentId),
          content,
        ];
        break;
    }

    // Add related content
    if (includeRelated && relatedContent.length > 0) {
      for (const lesson of relatedContent) {
        updatedOfflineData.lessons = [
          ...updatedOfflineData.lessons.filter(l => l.id !== lesson.id),
          lesson,
        ];
      }
    }

    // Update last synced timestamp
    updatedOfflineData.lastSynced = new Date().toISOString();

    // Save updated offline data
    await AsyncStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(updatedOfflineData));

    // Calculate size of downloaded content
    let size = 0;
    try {
      // Get all files related to this content
      const files = await FileSystem.readDir(OFFLINE_CONTENT_DIR);
      const contentFiles = files.filter(file =>
        file.name.startsWith(`${contentType}_${contentId}`) ||
        (includeRelated && relatedContent.length > 0 &&
          relatedContent.some(lesson => file.name.includes(`lesson_${lesson.id}`)))
      );

      // Sum up file sizes
      for (const file of contentFiles) {
        if (file.isFile()) {
          const stats = await FileSystem.stat(file.path);
          size += stats.size;
        }
      }
    } catch (error) {
      console.error('Error calculating content size:', error);
      // Continue with zero size if there's an error
    }

    return {
      success: true,
      message: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} downloaded for offline use`,
      relatedContentCount: relatedContent.length,
      size,
      contentType,
      contentId
    };
  } catch (error) {
    console.error(`Error downloading ${contentType}:`, error);
    return { success: false, message: `Failed to download ${contentType}` };
  }
};

/**
 * Remove offline content
 * @param {string} contentType - Type of content ('course', 'lesson', 'lab', 'assessment')
 * @param {string|number} contentId - ID of the content
 * @param {boolean} removeRelated - Whether to remove related content (e.g., lessons for a course)
 * @returns {Promise<Object>} Result of the removal operation
 */
export const removeOfflineContent = async (contentType, contentId, removeRelated = false) => {
  try {
    // Get current offline data
    const offlineData = await getOfflineData();

    // Update offline data
    const updatedOfflineData = { ...offlineData };

    // Remove content based on type
    switch (contentType) {
      case 'course':
        // If removeRelated is true, remove related lessons
        if (removeRelated) {
          const course = offlineData.courses.find(c => c.id === contentId);

          if (course && course.modules) {
            const lessonIds = [];

            for (const module of course.modules) {
              for (const lesson of module.lessons) {
                lessonIds.push(lesson.id);
              }
            }

            updatedOfflineData.lessons = updatedOfflineData.lessons.filter(
              lesson => !lessonIds.includes(lesson.id)
            );

            // Remove lesson files
            for (const lessonId of lessonIds) {
              await removeContentFiles('lesson', lessonId);
            }
          }
        }

        updatedOfflineData.courses = updatedOfflineData.courses.filter(c => c.id !== contentId);

        // Remove course files
        await removeContentFiles('course', contentId);
        break;

      case 'lesson':
        updatedOfflineData.lessons = updatedOfflineData.lessons.filter(l => l.id !== contentId);

        // Remove lesson files
        await removeContentFiles('lesson', contentId);
        break;

      case 'lab':
        updatedOfflineData.labs = updatedOfflineData.labs.filter(l => l.id !== contentId);

        // Remove lab files
        await removeContentFiles('lab', contentId);
        break;

      case 'assessment':
        updatedOfflineData.assessments = updatedOfflineData.assessments.filter(a => a.id !== contentId);
        break;

      default:
        return { success: false, message: 'Invalid content type' };
    }

    // Save updated offline data
    await AsyncStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(updatedOfflineData));

    // Calculate freed space (approximate)
    let freedSpace = 0;
    let relatedContentRemoved = 0;

    if (contentType === 'course' && removeRelated) {
      const course = offlineData.courses.find(c => c.id === contentId);
      if (course && course.modules) {
        for (const module of course.modules) {
          relatedContentRemoved += module.lessons.length;
        }
      }
    }

    return {
      success: true,
      message: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} removed from offline content`,
      freedSpace,
      relatedContentRemoved,
      contentType,
      contentId
    };
  } catch (error) {
    console.error(`Error removing ${contentType}:`, error);
    return { success: false, message: `Failed to remove ${contentType}` };
  }
};

/**
 * Sync offline progress with server
 * @returns {Promise<Object>} Result of the sync operation
 */
export const syncOfflineProgress = async () => {
  try {
    // Check network connectivity
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      return { success: false, message: 'No internet connection' };
    }

    // Get offline progress
    const offlineProgress = await getOfflineProgress();

    // If no progress to sync, return success
    if (Object.keys(offlineProgress).length === 0) {
      return { success: true, message: 'No progress to sync' };
    }

    // In a real implementation, this would send the progress to the server
    // and handle conflicts with server data

    // 1. Send progress to server
    // const response = await apiClient.post('/api/progress/sync', { progress: offlineProgress });

    // 2. Handle conflicts if any
    // if (response.data.conflicts) {
    //   const { resolveProgressConflicts } = require('../utils/conflictResolution');
    //   const resolvedProgress = resolveProgressConflicts(offlineProgress, response.data.serverProgress);
    //
    //   // Send resolved progress back to server
    //   await apiClient.post('/api/progress/resolve', { progress: resolvedProgress });
    // }

    // For now, we'll just clear the offline progress
    await AsyncStorage.setItem(OFFLINE_PROGRESS_KEY, JSON.stringify({}));

    return { success: true, message: 'Progress synced successfully' };
  } catch (error) {
    console.error('Error syncing offline progress:', error);
    return { success: false, message: 'Failed to sync progress' };
  }
};

/**
 * Get offline content size
 * @returns {Promise<Object>} Size information
 */
export const getOfflineContentSize = async () => {
  try {
    // Get offline data
    const offlineData = await getOfflineData();

    // Get directory size by reading all files
    let totalSize = 0;

    try {
      // Check if directory exists
      const dirExists = await FileSystem.exists(OFFLINE_CONTENT_DIR);

      if (dirExists) {
        // Get all files in the directory
        const files = await FileSystem.readDir(OFFLINE_CONTENT_DIR);

        // Sum up file sizes
        for (const file of files) {
          if (file.isFile()) {
            const stats = await FileSystem.stat(file.path);
            totalSize += stats.size;
          }
        }
      }
    } catch (error) {
      console.error('Error calculating directory size:', error);
      // Continue with zero size if there's an error
    }

    return {
      totalSize,
      courseCount: offlineData?.courses?.length || 0,
      lessonCount: offlineData?.lessons?.length || 0,
      labCount: offlineData?.labs?.length || 0,
      assessmentCount: offlineData?.assessments?.length || 0,
    };
  } catch (error) {
    console.error('Error getting offline content size:', error);
    throw error;
  }
};

/**
 * Get offline storage information
 * @returns {Promise<Object>} Storage information
 */
export const getOfflineStorageInfo = async () => {
  try {
    // Get content size
    const contentSize = await getOfflineContentSize();

    // Get device storage information
    const fsInfo = await FileSystem.getFSInfo();

    return {
      ...contentSize,
      availableStorage: fsInfo.freeSpace,
      totalDeviceStorage: fsInfo.totalSpace,
      percentUsed: contentSize.totalSize / fsInfo.totalSpace * 100,
    };
  } catch (error) {
    console.error('Error getting offline storage info:', error);

    // Return default values if there's an error
    return {
      totalSize: 0,
      courseCount: 0,
      lessonCount: 0,
      labCount: 0,
      assessmentCount: 0,
      availableStorage: 0,
      totalDeviceStorage: 0,
      percentUsed: 0,
    };
  }
};

/**
 * Clear all offline content
 * @returns {Promise<Object>} Result of the clear operation
 */
export const clearAllOfflineContent = async () => {
  try {
    // Clear offline data
    await AsyncStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify({
      courses: [],
      lessons: [],
      labs: [],
      assessments: [],
      lastSynced: null,
    }));

    // Clear offline progress
    await AsyncStorage.setItem(OFFLINE_PROGRESS_KEY, JSON.stringify({}));

    // Clear offline files
    await FileSystem.unlink(OFFLINE_CONTENT_DIR);
    await FileSystem.mkdir(OFFLINE_CONTENT_DIR);

    return { success: true, message: 'All offline content cleared' };
  } catch (error) {
    console.error('Error clearing offline content:', error);
    return { success: false, message: 'Failed to clear offline content' };
  }
};

// Helper functions

/**
 * Download a file for offline use
 * @param {string} url - URL of the file to download
 * @param {string} fileName - Name to save the file as
 * @param {Function} progressCallback - Callback function for download progress
 * @returns {Promise<string>} Path to the downloaded file
 */
const downloadFile = async (url, fileName, progressCallback = null) => {
  try {
    // Create file path
    const filePath = `${OFFLINE_CONTENT_DIR}/${fileName}`;

    // Check if file already exists
    const fileExists = await FileSystem.exists(filePath);

    if (fileExists) {
      return filePath;
    }

    // Download file with progress tracking
    const downloadTask = FileSystem.downloadFile({
      fromUrl: url,
      toFile: filePath,
      progressDivider: 10, // Report progress in 10% increments
      progressInterval: 100, // Report progress every 100ms
      begin: (res) => {
        console.log(`Download started for ${fileName}, size: ${res.contentLength} bytes`);
      },
      progress: (res) => {
        // Calculate progress percentage
        const progress = res.bytesWritten / res.contentLength;

        // Call progress callback if provided
        if (typeof progressCallback === 'function') {
          progressCallback(progress);
        }
      },
    });

    // Wait for download to complete
    const result = await downloadTask.promise;

    if (result.statusCode === 200) {
      return filePath;
    } else {
      throw new Error(`Failed to download file: ${result.statusCode}`);
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

/**
 * Remove content files
 * @param {string} contentType - Type of content
 * @param {string|number} contentId - ID of the content
 * @returns {Promise<void>}
 */
const removeContentFiles = async (contentType, contentId) => {
  try {
    // Get all files in the offline content directory
    const files = await FileSystem.readDir(OFFLINE_CONTENT_DIR);

    // Filter files related to the content
    const contentFiles = files.filter(file =>
      file.name.startsWith(`${contentType}_${contentId}`)
    );

    // Delete each file
    for (const file of contentFiles) {
      await FileSystem.unlink(`${OFFLINE_CONTENT_DIR}/${file.name}`);
    }
  } catch (error) {
    console.error('Error removing content files:', error);
    throw error;
  }
};
