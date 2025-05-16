/**
 * Synchronization Service
 * 
 * Handles synchronization of offline data with the server,
 * including progress tracking, notes, and other user-generated content.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Config from 'react-native-config';
import { Platform } from 'react-native';
import uuid from 'react-native-uuid';
import analytics from '../utils/analytics';

// Configuration
const API_URL = Config.API_URL;
const SYNC_ENDPOINT = `${API_URL}/sync`;
const PROGRESS_ENDPOINT = `${API_URL}/progress`;

// Storage keys
const SYNC_QUEUE_KEY = 'sync_queue';
const LAST_SYNC_KEY = 'last_sync_timestamp';
const SYNC_IN_PROGRESS_KEY = 'sync_in_progress';
const CONFLICT_RESOLUTION_KEY = 'conflict_resolution_policy';

// Constants
const MAX_RETRY_ATTEMPTS = 5;
const SYNC_INTERVAL = 60000; // 1 minute
const CONFLICT_POLICIES = {
  LOCAL_WINS: 'local_wins',
  SERVER_WINS: 'server_wins',
  MANUAL: 'manual'
};

// Default conflict resolution policy
let conflictResolutionPolicy = CONFLICT_POLICIES.SERVER_WINS;

/**
 * Initialize the sync service
 * @param {Object} options - Configuration options
 * @returns {Promise<void>}
 */
export const initializeSyncService = async (options = {}) => {
  try {
    // Load conflict resolution policy from storage
    const storedPolicy = await AsyncStorage.getItem(CONFLICT_RESOLUTION_KEY);
    if (storedPolicy) {
      conflictResolutionPolicy = storedPolicy;
    }
    
    // Override with options if provided
    if (options.conflictPolicy && Object.values(CONFLICT_POLICIES).includes(options.conflictPolicy)) {
      conflictResolutionPolicy = options.conflictPolicy;
      await AsyncStorage.setItem(CONFLICT_RESOLUTION_KEY, conflictResolutionPolicy);
    }
    
    // Start periodic sync if enabled
    if (options.enablePeriodicSync !== false) {
      startPeriodicSync();
    }
    
    // Log initialization
    console.log('Sync service initialized with policy:', conflictResolutionPolicy);
    
    return true;
  } catch (error) {
    console.error('Failed to initialize sync service:', error);
    return false;
  }
};

/**
 * Start periodic synchronization
 */
let syncInterval = null;
export const startPeriodicSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  
  syncInterval = setInterval(async () => {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      synchronize().catch(err => {
        console.error('Periodic sync failed:', err);
      });
    }
  }, SYNC_INTERVAL);
  
  console.log('Periodic sync started');
};

/**
 * Stop periodic synchronization
 */
export const stopPeriodicSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('Periodic sync stopped');
  }
};

/**
 * Queue an item for synchronization
 * @param {string} type - Type of data to sync (progress, note, bookmark, etc.)
 * @param {Object} data - Data to synchronize
 * @returns {Promise<string>} ID of the queued item
 */
export const queueForSync = async (type, data) => {
  try {
    // Generate a unique ID for this sync item
    const syncId = uuid.v4();
    
    // Create sync item
    const syncItem = {
      id: syncId,
      type,
      data,
      timestamp: Date.now(),
      deviceId: await getDeviceId(),
      attempts: 0,
      status: 'pending'
    };
    
    // Get current sync queue
    const queue = await getSyncQueue();
    
    // Add item to queue
    queue.push(syncItem);
    
    // Save updated queue
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    
    // Log queued item
    console.log(`Item queued for sync: ${type}`, syncId);
    
    // Try to sync immediately if online
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      synchronize().catch(err => {
        console.error('Immediate sync failed:', err);
      });
    }
    
    return syncId;
  } catch (error) {
    console.error('Failed to queue item for sync:', error);
    throw error;
  }
};

/**
 * Get the current sync queue
 * @returns {Promise<Array>} Array of queued sync items
 */
export const getSyncQueue = async () => {
  try {
    const queueJson = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    return queueJson ? JSON.parse(queueJson) : [];
  } catch (error) {
    console.error('Failed to get sync queue:', error);
    return [];
  }
};

/**
 * Get device ID for sync tracking
 * @returns {Promise<string>} Device ID
 */
export const getDeviceId = async () => {
  try {
    let deviceId = await AsyncStorage.getItem('device_id');
    
    if (!deviceId) {
      deviceId = `${Platform.OS}_${uuid.v4()}`;
      await AsyncStorage.setItem('device_id', deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Failed to get device ID:', error);
    return `${Platform.OS}_${Date.now()}`;
  }
};

/**
 * Synchronize offline data with the server
 * @returns {Promise<Object>} Sync result
 */
export const synchronize = async () => {
  // Check if sync is already in progress
  const syncInProgress = await AsyncStorage.getItem(SYNC_IN_PROGRESS_KEY);
  if (syncInProgress === 'true') {
    console.log('Sync already in progress, skipping');
    return { status: 'skipped', reason: 'already_in_progress' };
  }
  
  try {
    // Mark sync as in progress
    await AsyncStorage.setItem(SYNC_IN_PROGRESS_KEY, 'true');
    
    // Check network connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log('No network connection, skipping sync');
      await AsyncStorage.setItem(SYNC_IN_PROGRESS_KEY, 'false');
      return { status: 'skipped', reason: 'offline' };
    }
    
    // Get sync queue
    const queue = await getSyncQueue();
    if (queue.length === 0) {
      console.log('Sync queue empty, nothing to sync');
      await AsyncStorage.setItem(SYNC_IN_PROGRESS_KEY, 'false');
      return { status: 'success', itemsSynced: 0 };
    }
    
    // Get last sync timestamp
    const lastSyncTimestamp = await AsyncStorage.getItem(LAST_SYNC_KEY) || '0';
    
    // Track sync start
    analytics.trackEvent('sync_started', {
      queue_size: queue.length,
      last_sync: lastSyncTimestamp
    });
    
    // Create axios instance
    const api = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    // Add auth token
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Prepare sync payload
    const syncPayload = {
      deviceId: await getDeviceId(),
      lastSyncTimestamp: parseInt(lastSyncTimestamp, 10),
      items: queue.filter(item => item.status === 'pending'),
      deviceInfo: {
        platform: Platform.OS,
        version: Platform.Version,
        model: Platform.OS === 'ios' ? Platform.constants.model : Platform.constants.Brand
      }
    };
    
    // Send sync request
    const response = await api.post(SYNC_ENDPOINT, syncPayload);
    
    // Process server response
    const syncResult = response.data;
    
    // Handle conflicts
    if (syncResult.conflicts && syncResult.conflicts.length > 0) {
      await handleConflicts(syncResult.conflicts);
    }
    
    // Update sync queue with results
    const updatedQueue = await updateSyncQueue(queue, syncResult);
    
    // Save updated queue
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updatedQueue));
    
    // Update last sync timestamp
    await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    
    // Track sync completion
    analytics.trackEvent('sync_completed', {
      items_synced: syncResult.syncedItems?.length || 0,
      conflicts: syncResult.conflicts?.length || 0,
      failed_items: syncResult.failedItems?.length || 0
    });
    
    // Mark sync as complete
    await AsyncStorage.setItem(SYNC_IN_PROGRESS_KEY, 'false');
    
    return {
      status: 'success',
      itemsSynced: syncResult.syncedItems?.length || 0,
      conflicts: syncResult.conflicts?.length || 0,
      failedItems: syncResult.failedItems?.length || 0
    };
  } catch (error) {
    console.error('Sync failed:', error);
    
    // Track sync failure
    analytics.trackEvent('sync_failed', {
      error: error.message
    });
    
    // Mark sync as complete
    await AsyncStorage.setItem(SYNC_IN_PROGRESS_KEY, 'false');
    
    return {
      status: 'error',
      error: error.message
    };
  }
};

/**
 * Update sync queue with server response
 * @param {Array} queue - Current sync queue
 * @param {Object} syncResult - Server sync result
 * @returns {Promise<Array>} Updated sync queue
 */
const updateSyncQueue = async (queue, syncResult) => {
  // Process successfully synced items
  if (syncResult.syncedItems && syncResult.syncedItems.length > 0) {
    // Remove successfully synced items from queue
    queue = queue.filter(item => !syncResult.syncedItems.includes(item.id));
  }
  
  // Process failed items
  if (syncResult.failedItems && syncResult.failedItems.length > 0) {
    queue = queue.map(item => {
      const failedItem = syncResult.failedItems.find(fi => fi.id === item.id);
      if (failedItem) {
        return {
          ...item,
          attempts: item.attempts + 1,
          status: item.attempts >= MAX_RETRY_ATTEMPTS ? 'failed' : 'pending',
          error: failedItem.error
        };
      }
      return item;
    });
  }
  
  // Process server changes
  if (syncResult.serverChanges && syncResult.serverChanges.length > 0) {
    await processServerChanges(syncResult.serverChanges);
  }
  
  return queue;
};

/**
 * Process changes from the server
 * @param {Array} changes - Server changes
 * @returns {Promise<void>}
 */
const processServerChanges = async (changes) => {
  for (const change of changes) {
    try {
      switch (change.type) {
        case 'progress':
          await updateLocalProgress(change.data);
          break;
        case 'note':
          await updateLocalNote(change.data);
          break;
        case 'bookmark':
          await updateLocalBookmark(change.data);
          break;
        default:
          console.warn('Unknown change type:', change.type);
      }
    } catch (error) {
      console.error(`Failed to process server change (${change.type}):`, error);
    }
  }
};

/**
 * Update local progress data
 * @param {Object} progressData - Progress data from server
 * @returns {Promise<void>}
 */
const updateLocalProgress = async (progressData) => {
  try {
    const storageKey = `progress_${progressData.courseId}`;
    const localProgressJson = await AsyncStorage.getItem(storageKey);
    const localProgress = localProgressJson ? JSON.parse(localProgressJson) : { modules: {} };
    
    // Merge server progress with local progress
    const updatedProgress = {
      ...localProgress,
      lastUpdated: progressData.timestamp,
      modules: {
        ...localProgress.modules,
        ...progressData.modules
      }
    };
    
    // Save updated progress
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedProgress));
    
    console.log('Local progress updated from server:', progressData.courseId);
  } catch (error) {
    console.error('Failed to update local progress:', error);
    throw error;
  }
};

/**
 * Update local note data
 * @param {Object} noteData - Note data from server
 * @returns {Promise<void>}
 */
const updateLocalNote = async (noteData) => {
  try {
    const storageKey = `notes_${noteData.courseId}`;
    const localNotesJson = await AsyncStorage.getItem(storageKey);
    const localNotes = localNotesJson ? JSON.parse(localNotesJson) : [];
    
    // Check if note already exists
    const existingNoteIndex = localNotes.findIndex(note => note.id === noteData.id);
    
    if (existingNoteIndex >= 0) {
      // Update existing note
      localNotes[existingNoteIndex] = {
        ...localNotes[existingNoteIndex],
        ...noteData,
        lastUpdated: noteData.timestamp
      };
    } else {
      // Add new note
      localNotes.push({
        ...noteData,
        lastUpdated: noteData.timestamp
      });
    }
    
    // Save updated notes
    await AsyncStorage.setItem(storageKey, JSON.stringify(localNotes));
    
    console.log('Local note updated from server:', noteData.id);
  } catch (error) {
    console.error('Failed to update local note:', error);
    throw error;
  }
};

/**
 * Update local bookmark data
 * @param {Object} bookmarkData - Bookmark data from server
 * @returns {Promise<void>}
 */
const updateLocalBookmark = async (bookmarkData) => {
  try {
    const storageKey = `bookmarks_${bookmarkData.courseId}`;
    const localBookmarksJson = await AsyncStorage.getItem(storageKey);
    const localBookmarks = localBookmarksJson ? JSON.parse(localBookmarksJson) : [];
    
    // Check if bookmark already exists
    const existingBookmarkIndex = localBookmarks.findIndex(bookmark => bookmark.id === bookmarkData.id);
    
    if (existingBookmarkIndex >= 0) {
      // Update existing bookmark
      localBookmarks[existingBookmarkIndex] = {
        ...localBookmarks[existingBookmarkIndex],
        ...bookmarkData,
        lastUpdated: bookmarkData.timestamp
      };
    } else {
      // Add new bookmark
      localBookmarks.push({
        ...bookmarkData,
        lastUpdated: bookmarkData.timestamp
      });
    }
    
    // Save updated bookmarks
    await AsyncStorage.setItem(storageKey, JSON.stringify(localBookmarks));
    
    console.log('Local bookmark updated from server:', bookmarkData.id);
  } catch (error) {
    console.error('Failed to update local bookmark:', error);
    throw error;
  }
};

/**
 * Handle sync conflicts
 * @param {Array} conflicts - Sync conflicts
 * @returns {Promise<void>}
 */
const handleConflicts = async (conflicts) => {
  for (const conflict of conflicts) {
    try {
      switch (conflictResolutionPolicy) {
        case CONFLICT_POLICIES.LOCAL_WINS:
          // Re-queue local changes with higher priority
          await requeueLocalChange(conflict.localItem);
          break;
          
        case CONFLICT_POLICIES.SERVER_WINS:
          // Apply server changes
          await applyServerChange(conflict.serverItem);
          break;
          
        case CONFLICT_POLICIES.MANUAL:
          // Store conflict for manual resolution
          await storeConflictForManualResolution(conflict);
          break;
          
        default:
          console.warn('Unknown conflict resolution policy:', conflictResolutionPolicy);
          // Default to server wins
          await applyServerChange(conflict.serverItem);
      }
    } catch (error) {
      console.error('Failed to handle conflict:', error);
    }
  }
};

/**
 * Requeue local change with higher priority
 * @param {Object} localItem - Local sync item
 * @returns {Promise<void>}
 */
const requeueLocalChange = async (localItem) => {
  await queueForSync(localItem.type, {
    ...localItem.data,
    priority: 'high',
    conflictResolution: 'local_wins'
  });
};

/**
 * Apply server change
 * @param {Object} serverItem - Server sync item
 * @returns {Promise<void>}
 */
const applyServerChange = async (serverItem) => {
  switch (serverItem.type) {
    case 'progress':
      await updateLocalProgress(serverItem.data);
      break;
    case 'note':
      await updateLocalNote(serverItem.data);
      break;
    case 'bookmark':
      await updateLocalBookmark(serverItem.data);
      break;
    default:
      console.warn('Unknown server item type:', serverItem.type);
  }
};

/**
 * Store conflict for manual resolution
 * @param {Object} conflict - Conflict data
 * @returns {Promise<void>}
 */
const storeConflictForManualResolution = async (conflict) => {
  try {
    const conflictsKey = 'sync_conflicts';
    const conflictsJson = await AsyncStorage.getItem(conflictsKey);
    const conflicts = conflictsJson ? JSON.parse(conflictsJson) : [];
    
    conflicts.push({
      ...conflict,
      timestamp: Date.now(),
      status: 'pending'
    });
    
    await AsyncStorage.setItem(conflictsKey, JSON.stringify(conflicts));
    
    // Notify UI about conflict
    global.EventEmitter.emit('SYNC_CONFLICT_DETECTED', {
      type: conflict.type,
      count: conflicts.length
    });
  } catch (error) {
    console.error('Failed to store conflict for manual resolution:', error);
    throw error;
  }
};

/**
 * Get pending conflicts for manual resolution
 * @returns {Promise<Array>} Pending conflicts
 */
export const getPendingConflicts = async () => {
  try {
    const conflictsKey = 'sync_conflicts';
    const conflictsJson = await AsyncStorage.getItem(conflictsKey);
    const conflicts = conflictsJson ? JSON.parse(conflictsJson) : [];
    
    return conflicts.filter(conflict => conflict.status === 'pending');
  } catch (error) {
    console.error('Failed to get pending conflicts:', error);
    return [];
  }
};

/**
 * Resolve a conflict manually
 * @param {string} conflictId - Conflict ID
 * @param {string} resolution - Resolution type ('local' or 'server')
 * @returns {Promise<boolean>} Success status
 */
export const resolveConflict = async (conflictId, resolution) => {
  try {
    const conflictsKey = 'sync_conflicts';
    const conflictsJson = await AsyncStorage.getItem(conflictsKey);
    const conflicts = conflictsJson ? JSON.parse(conflictsJson) : [];
    
    const conflictIndex = conflicts.findIndex(conflict => conflict.id === conflictId);
    if (conflictIndex < 0) {
      console.warn('Conflict not found:', conflictId);
      return false;
    }
    
    const conflict = conflicts[conflictIndex];
    
    if (resolution === 'local') {
      await requeueLocalChange(conflict.localItem);
    } else if (resolution === 'server') {
      await applyServerChange(conflict.serverItem);
    } else {
      console.warn('Unknown resolution type:', resolution);
      return false;
    }
    
    // Mark conflict as resolved
    conflicts[conflictIndex] = {
      ...conflict,
      status: 'resolved',
      resolution,
      resolvedAt: Date.now()
    };
    
    await AsyncStorage.setItem(conflictsKey, JSON.stringify(conflicts));
    
    return true;
  } catch (error) {
    console.error('Failed to resolve conflict:', error);
    return false;
  }
};

/**
 * Set conflict resolution policy
 * @param {string} policy - Conflict resolution policy
 * @returns {Promise<boolean>} Success status
 */
export const setConflictResolutionPolicy = async (policy) => {
  if (!Object.values(CONFLICT_POLICIES).includes(policy)) {
    console.warn('Invalid conflict resolution policy:', policy);
    return false;
  }
  
  try {
    conflictResolutionPolicy = policy;
    await AsyncStorage.setItem(CONFLICT_RESOLUTION_KEY, policy);
    return true;
  } catch (error) {
    console.error('Failed to set conflict resolution policy:', error);
    return false;
  }
};

/**
 * Get current conflict resolution policy
 * @returns {Promise<string>} Current policy
 */
export const getConflictResolutionPolicy = async () => {
  try {
    const policy = await AsyncStorage.getItem(CONFLICT_RESOLUTION_KEY);
    return policy || conflictResolutionPolicy;
  } catch (error) {
    console.error('Failed to get conflict resolution policy:', error);
    return conflictResolutionPolicy;
  }
};

/**
 * Force immediate synchronization
 * @returns {Promise<Object>} Sync result
 */
export const forceSynchronization = async () => {
  // Clear in-progress flag in case of previous failure
  await AsyncStorage.setItem(SYNC_IN_PROGRESS_KEY, 'false');
  
  // Perform sync
  return synchronize();
};

export default {
  initializeSyncService,
  startPeriodicSync,
  stopPeriodicSync,
  queueForSync,
  getSyncQueue,
  synchronize,
  forceSynchronization,
  getPendingConflicts,
  resolveConflict,
  setConflictResolutionPolicy,
  getConflictResolutionPolicy,
  CONFLICT_POLICIES
};
