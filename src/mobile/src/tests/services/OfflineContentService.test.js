/**
 * Tests for the OfflineContentService
 *
 * This file contains tests for the enhanced offline content service with
 * download progress tracking, storage management, and analytics integration.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as FileSystem from 'react-native-fs';
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
} from '../../services/OfflineContentService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

// Mock FileSystem
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/path',
  exists: jest.fn(),
  mkdir: jest.fn(),
  readDir: jest.fn(),
  stat: jest.fn(),
  unlink: jest.fn(),
  getFSInfo: jest.fn(),
  downloadFile: jest.fn(),
}));

// Mock API services
jest.mock('../../services/api/courseService', () => ({
  fetchCourseDetails: jest.fn(),
  fetchLessonDetails: jest.fn(),
}));

jest.mock('../../services/api/labService', () => ({
  fetchLabDetails: jest.fn(),
}));

jest.mock('../../services/api/assessmentService', () => ({
  fetchAssessmentDetails: jest.fn(),
}));

// Mock analytics
jest.mock('../../utils/analytics', () => ({
  trackEvent: jest.fn(),
  logError: jest.fn(),
}));

describe('OfflineContentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    NetInfo.fetch.mockResolvedValue({ isConnected: true, isInternetReachable: true });

    // Mock FileSystem
    FileSystem.exists.mockResolvedValue(true);
    FileSystem.mkdir.mockResolvedValue(true);
    FileSystem.readDir.mockResolvedValue([]);
    FileSystem.stat.mockResolvedValue({ size: 1024, isFile: () => true });
    FileSystem.unlink.mockResolvedValue(true);
    FileSystem.getFSInfo.mockResolvedValue({
      freeSpace: 1024 * 1024 * 1024, // 1GB
      totalSpace: 10 * 1024 * 1024 * 1024, // 10GB
    });

    // Mock download file
    FileSystem.downloadFile.mockReturnValue({
      promise: Promise.resolve({ statusCode: 200 }),
      jobId: 1,
    });

    // Import API service mocks
    const { fetchCourseDetails, fetchLessonDetails } = require('../../services/api/courseService');
    const { fetchLabDetails } = require('../../services/api/labService');
    const { fetchAssessmentDetails } = require('../../services/api/assessmentService');

    // Setup API service mocks
    fetchCourseDetails.mockResolvedValue({
      id: 'course1',
      title: 'Test Course',
      image: 'https://example.com/image.jpg',
      modules: [
        {
          id: 'module1',
          title: 'Module 1',
          lessons: [
            { id: 'lesson1', title: 'Lesson 1' },
            { id: 'lesson2', title: 'Lesson 2' },
          ],
        },
      ],
    });

    fetchLessonDetails.mockResolvedValue({
      id: 'lesson1',
      title: 'Test Lesson',
      sections: [
        {
          id: 'section1',
          title: 'Section 1',
          videoUrl: 'https://example.com/video.mp4',
        },
      ],
    });

    fetchLabDetails.mockResolvedValue({
      id: 'lab1',
      title: 'Test Lab',
      image: 'https://example.com/lab.jpg',
    });

    fetchAssessmentDetails.mockResolvedValue({
      id: 'assessment1',
      title: 'Test Assessment',
    });
  });

  describe('initializeOfflineContent', () => {
    it('initializes offline content if not already initialized', async () => {
      // Mock AsyncStorage.getItem to return null (not initialized)
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      await initializeOfflineContent();

      // Check if AsyncStorage.setItem was called with the correct parameters
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('offlineData', JSON.stringify({
        courses: [],
        lessons: [],
        labs: [],
        assessments: [],
        lastSynced: null,
      }));

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('offlineProgress', JSON.stringify({}));
    });

    it('does not initialize offline content if already initialized', async () => {
      // Mock AsyncStorage.getItem to return existing data
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({
        courses: [],
        lessons: [],
        labs: [],
        assessments: [],
        lastSynced: null,
      }));

      await initializeOfflineContent();

      // Check if AsyncStorage.setItem was not called
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('getOfflineData', () => {
    it('returns offline data from AsyncStorage', async () => {
      const mockData = {
        courses: [{ id: 1, title: 'Test Course' }],
        lessons: [],
        labs: [],
        assessments: [],
        lastSynced: null,
      };

      // Mock AsyncStorage.getItem to return mock data
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockData));

      const result = await getOfflineData();

      // Check if the result matches the mock data
      expect(result).toEqual(mockData);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('offlineData');
    });

    it('returns null if no offline data exists', async () => {
      // Mock AsyncStorage.getItem to return null
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await getOfflineData();

      // Check if the result is null
      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('offlineData');
    });
  });

  describe('getOfflineProgress', () => {
    it('returns offline progress from AsyncStorage', async () => {
      const mockProgress = {
        'course_1_progress': 0.5,
        'lesson_1_completed': true,
      };

      // Mock AsyncStorage.getItem to return mock progress
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockProgress));

      const result = await getOfflineProgress();

      // Check if the result matches the mock progress
      expect(result).toEqual(mockProgress);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('offlineProgress');
    });

    it('returns empty object if no offline progress exists', async () => {
      // Mock AsyncStorage.getItem to return null
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await getOfflineProgress();

      // Check if the result is an empty object
      expect(result).toEqual({});
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('offlineProgress');
    });
  });

  describe('updateOfflineProgress', () => {
    it('updates offline progress in AsyncStorage', async () => {
      const existingProgress = {
        'course_1_progress': 0.5,
      };

      const newProgress = {
        'lesson_1_completed': true,
      };

      const expectedProgress = {
        'course_1_progress': 0.5,
        'lesson_1_completed': true,
      };

      // Mock AsyncStorage.getItem to return existing progress
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingProgress));

      await updateOfflineProgress(newProgress);

      // Check if AsyncStorage.setItem was called with the correct parameters
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('offlineProgress', JSON.stringify(expectedProgress));
    });
  });

  describe('syncOfflineProgress', () => {
    it('syncs offline progress when online', async () => {
      // Mock NetInfo.fetch to return online status
      NetInfo.fetch.mockResolvedValueOnce({ isConnected: true });

      const mockProgress = {
        'course_1_progress': 0.5,
        'lesson_1_completed': true,
      };

      // Mock AsyncStorage.getItem to return mock progress
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockProgress));

      const result = await syncOfflineProgress();

      // Check if AsyncStorage.setItem was called to clear progress
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('offlineProgress', JSON.stringify({}));

      // Check if the result indicates success
      expect(result.success).toBe(true);
    });

    it('does not sync offline progress when offline', async () => {
      // Mock NetInfo.fetch to return offline status
      NetInfo.fetch.mockResolvedValueOnce({ isConnected: false });

      const result = await syncOfflineProgress();

      // Check if AsyncStorage.setItem was not called
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();

      // Check if the result indicates failure
      expect(result.success).toBe(false);
      expect(result.message).toBe('No internet connection');
    });

    it('does not sync if there is no progress to sync', async () => {
      // Mock NetInfo.fetch to return online status
      NetInfo.fetch.mockResolvedValueOnce({ isConnected: true });

      // Mock AsyncStorage.getItem to return empty progress
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({}));

      const result = await syncOfflineProgress();

      // Check if AsyncStorage.setItem was not called
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();

      // Check if the result indicates success but no changes
      expect(result.success).toBe(true);
      expect(result.message).toBe('No progress to sync');
    });
  });

  describe('clearAllOfflineContent', () => {
    it('clears all offline content from AsyncStorage', async () => {
      await clearAllOfflineContent();

      // Check if AsyncStorage.setItem was called with empty data
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('offlineData', JSON.stringify({
        courses: [],
        lessons: [],
        labs: [],
        assessments: [],
        lastSynced: null,
      }));

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('offlineProgress', JSON.stringify({}));

      // Check if the result indicates success
      expect(await clearAllOfflineContent()).toEqual({
        success: true,
        message: 'All offline content cleared',
      });
    });
  });

  describe('downloadContent with progress tracking', () => {
    it('tracks download progress with callback', async () => {
      // Setup
      const progressCallback = jest.fn();
      const mockDownloadTask = {
        promise: Promise.resolve({ statusCode: 200 }),
        jobId: 1,
      };

      FileSystem.downloadFile.mockReturnValue(mockDownloadTask);

      // Mock AsyncStorage.getItem to return empty data
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify({
        courses: [],
        lessons: [],
        labs: [],
        assessments: [],
        lastSynced: null,
      }));

      // Execute
      const result = await downloadContent('course', 'course1', true, progressCallback);

      // Verify
      expect(result.success).toBe(true);
      expect(result.contentType).toBe('course');
      expect(result.contentId).toBe('course1');
      expect(FileSystem.downloadFile).toHaveBeenCalled();

      // Simulate progress event
      const progressHandler = FileSystem.downloadFile.mock.calls[0][0].progress;
      progressHandler({ bytesWritten: 500, contentLength: 1000 });

      // Verify progress callback was called
      expect(progressCallback).toHaveBeenCalledWith(0.5);
    });

    it('handles offline state gracefully', async () => {
      // Setup
      NetInfo.fetch.mockResolvedValue({ isConnected: false });

      // Execute
      const result = await downloadContent('course', 'course1');

      // Verify
      expect(result.success).toBe(false);
      expect(result.message).toBe('No internet connection');
      expect(FileSystem.downloadFile).not.toHaveBeenCalled();
    });
  });

  describe('getOfflineContentSize', () => {
    it('calculates size of offline content', async () => {
      // Setup
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify({
        courses: [{ id: 'course1' }],
        lessons: [{ id: 'lesson1' }, { id: 'lesson2' }],
        labs: [{ id: 'lab1' }],
        assessments: [],
      }));

      FileSystem.readDir.mockResolvedValue([
        { name: 'course_1_image', path: '/mock/path/course_1_image', isFile: () => true },
        { name: 'lesson_1_video', path: '/mock/path/lesson_1_video', isFile: () => true },
      ]);

      // Execute
      const result = await getOfflineContentSize();

      // Verify
      expect(result.totalSize).toBe(2048); // 2 files * 1024 bytes
      expect(result.courseCount).toBe(1);
      expect(result.lessonCount).toBe(2);
      expect(result.labCount).toBe(1);
      expect(result.assessmentCount).toBe(0);
    });

    it('handles errors gracefully', async () => {
      // Setup
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify({
        courses: [{ id: 'course1' }],
        lessons: [],
        labs: [],
        assessments: [],
      }));

      FileSystem.readDir.mockRejectedValue(new Error('File system error'));

      // Execute
      const result = await getOfflineContentSize();

      // Verify - should still return course count even if file size calculation fails
      expect(result.totalSize).toBe(0);
      expect(result.courseCount).toBe(1);
    });
  });

  describe('getOfflineStorageInfo', () => {
    it('returns comprehensive storage information', async () => {
      // Setup
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify({
        courses: [{ id: 'course1' }],
        lessons: [{ id: 'lesson1' }],
        labs: [],
        assessments: [],
      }));

      FileSystem.readDir.mockResolvedValue([
        { name: 'course_1_image', path: '/mock/path/course_1_image', isFile: () => true },
      ]);

      // Execute
      const result = await getOfflineStorageInfo();

      // Verify
      expect(result.totalSize).toBe(1024);
      expect(result.courseCount).toBe(1);
      expect(result.lessonCount).toBe(1);
      expect(result.availableStorage).toBe(1024 * 1024 * 1024);
      expect(result.totalDeviceStorage).toBe(10 * 1024 * 1024 * 1024);
      expect(result.percentUsed).toBe((1024 / (10 * 1024 * 1024 * 1024)) * 100);
    });

    it('handles errors gracefully', async () => {
      // Setup
      AsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));
      FileSystem.getFSInfo.mockRejectedValue(new Error('FS info error'));

      // Execute
      const result = await getOfflineStorageInfo();

      // Verify - should return default values
      expect(result.totalSize).toBe(0);
      expect(result.courseCount).toBe(0);
      expect(result.availableStorage).toBe(0);
    });
  });
});
