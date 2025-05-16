/**
 * Power Management Service
 * 
 * Provides utilities for optimizing power consumption in the app,
 * particularly during lab sessions which can be resource-intensive.
 */

import { Platform, NativeModules, NativeEventEmitter, AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import analytics from '../utils/analytics';

// Constants
const POWER_MODE_KEY = 'power_mode';
const POLLING_INTERVALS = {
  LAB_ACTIVE: 5000,      // 5 seconds when lab is active
  LAB_BACKGROUND: 30000, // 30 seconds when lab is in background
  NORMAL: 60000,         // 60 seconds in normal mode
  BATTERY_SAVER: 120000  // 2 minutes in battery saver mode
};

// Power modes
export const POWER_MODES = {
  PERFORMANCE: 'performance',  // Prioritize performance over battery life
  BALANCED: 'balanced',        // Balance performance and battery life (default)
  BATTERY_SAVER: 'battery_saver' // Prioritize battery life over performance
};

// Default power mode
let currentPowerMode = POWER_MODES.BALANCED;

// Polling intervals
let pollingIntervals = {
  labStatus: POLLING_INTERVALS.NORMAL,
  networkSync: POLLING_INTERVALS.NORMAL,
  contentRefresh: POLLING_INTERVALS.NORMAL
};

// Active timers
const activeTimers = {};

// Battery status
let batteryStatus = {
  level: 1.0,
  charging: false,
  lowPowerMode: false
};

// App state
let appState = AppState.currentState;
let isLabActive = false;

/**
 * Initialize the power management service
 * @returns {Promise<void>}
 */
export const initializePowerManagement = async () => {
  try {
    // Load saved power mode
    const savedMode = await AsyncStorage.getItem(POWER_MODE_KEY);
    if (savedMode && Object.values(POWER_MODES).includes(savedMode)) {
      currentPowerMode = savedMode;
    }
    
    // Set up battery monitoring
    setupBatteryMonitoring();
    
    // Set up app state monitoring
    setupAppStateMonitoring();
    
    // Update polling intervals based on current mode
    updatePollingIntervals();
    
    console.log('Power management initialized with mode:', currentPowerMode);
    
    return true;
  } catch (error) {
    console.error('Failed to initialize power management:', error);
    return false;
  }
};

/**
 * Set up battery monitoring
 */
const setupBatteryMonitoring = () => {
  if (Platform.OS === 'ios') {
    // iOS battery monitoring
    NativeModules.RNCBattery?.getBatteryStatus((status) => {
      batteryStatus = status;
    });
    
    const batteryEventEmitter = new NativeEventEmitter(NativeModules.RNCBattery);
    batteryEventEmitter.addListener('BatteryStatus', (status) => {
      batteryStatus = status;
      
      // Auto-switch to battery saver mode when battery is low
      if (status.level <= 0.2 && !status.charging && currentPowerMode !== POWER_MODES.BATTERY_SAVER) {
        setPowerMode(POWER_MODES.BATTERY_SAVER);
      }
    });
  } else if (Platform.OS === 'android') {
    // Android battery monitoring
    NativeModules.RNCBattery?.getBatteryStatus((status) => {
      batteryStatus = status;
    });
    
    const batteryEventEmitter = new NativeEventEmitter(NativeModules.RNCBattery);
    batteryEventEmitter.addListener('BatteryStatus', (status) => {
      batteryStatus = status;
      
      // Auto-switch to battery saver mode when battery is low
      if (status.level <= 0.2 && !status.charging && currentPowerMode !== POWER_MODES.BATTERY_SAVER) {
        setPowerMode(POWER_MODES.BATTERY_SAVER);
      }
    });
  }
};

/**
 * Set up app state monitoring
 */
const setupAppStateMonitoring = () => {
  AppState.addEventListener('change', (nextAppState) => {
    const wasActive = appState === 'active';
    const isNowActive = nextAppState === 'active';
    
    appState = nextAppState;
    
    // Update polling intervals when app state changes
    if (wasActive !== isNowActive) {
      updatePollingIntervals();
    }
  });
};

/**
 * Update polling intervals based on current mode and app state
 */
const updatePollingIntervals = () => {
  const isActive = appState === 'active';
  
  if (isLabActive) {
    // Lab is active - use lab-specific intervals
    pollingIntervals = {
      labStatus: isActive ? POLLING_INTERVALS.LAB_ACTIVE : POLLING_INTERVALS.LAB_BACKGROUND,
      networkSync: isActive ? POLLING_INTERVALS.LAB_ACTIVE : POLLING_INTERVALS.LAB_BACKGROUND,
      contentRefresh: isActive ? POLLING_INTERVALS.NORMAL : POLLING_INTERVALS.LAB_BACKGROUND
    };
  } else {
    // No lab active - use mode-specific intervals
    switch (currentPowerMode) {
      case POWER_MODES.PERFORMANCE:
        pollingIntervals = {
          labStatus: POLLING_INTERVALS.NORMAL / 2, // Faster polling in performance mode
          networkSync: POLLING_INTERVALS.NORMAL / 2,
          contentRefresh: POLLING_INTERVALS.NORMAL / 2
        };
        break;
        
      case POWER_MODES.BATTERY_SAVER:
        pollingIntervals = {
          labStatus: POLLING_INTERVALS.BATTERY_SAVER,
          networkSync: POLLING_INTERVALS.BATTERY_SAVER,
          contentRefresh: POLLING_INTERVALS.BATTERY_SAVER
        };
        break;
        
      case POWER_MODES.BALANCED:
      default:
        pollingIntervals = {
          labStatus: POLLING_INTERVALS.NORMAL,
          networkSync: POLLING_INTERVALS.NORMAL,
          contentRefresh: POLLING_INTERVALS.NORMAL
        };
        break;
    }
    
    // If app is not active, use longer intervals
    if (!isActive) {
      pollingIntervals = {
        labStatus: pollingIntervals.labStatus * 2,
        networkSync: pollingIntervals.networkSync * 2,
        contentRefresh: pollingIntervals.contentRefresh * 2
      };
    }
  }
  
  // Update any active timers with new intervals
  Object.keys(activeTimers).forEach((timerName) => {
    if (activeTimers[timerName].interval !== pollingIntervals[timerName]) {
      restartTimer(timerName, activeTimers[timerName].callback);
    }
  });
};

/**
 * Set the current power mode
 * @param {string} mode - Power mode to set
 * @returns {Promise<boolean>} Success status
 */
export const setPowerMode = async (mode) => {
  if (!Object.values(POWER_MODES).includes(mode)) {
    console.warn('Invalid power mode:', mode);
    return false;
  }
  
  try {
    // Save the new mode
    currentPowerMode = mode;
    await AsyncStorage.setItem(POWER_MODE_KEY, mode);
    
    // Update polling intervals
    updatePollingIntervals();
    
    // Apply mode-specific optimizations
    applyPowerModeOptimizations(mode);
    
    // Track mode change
    analytics.trackEvent('power_mode_changed', {
      mode,
      battery_level: batteryStatus.level,
      charging: batteryStatus.charging
    });
    
    console.log('Power mode set to:', mode);
    
    return true;
  } catch (error) {
    console.error('Failed to set power mode:', error);
    return false;
  }
};

/**
 * Get the current power mode
 * @returns {string} Current power mode
 */
export const getPowerMode = () => {
  return currentPowerMode;
};

/**
 * Apply power mode specific optimizations
 * @param {string} mode - Power mode to apply
 */
const applyPowerModeOptimizations = (mode) => {
  switch (mode) {
    case POWER_MODES.PERFORMANCE:
      // Performance optimizations
      if (Platform.OS === 'android') {
        // Android-specific performance optimizations
        NativeModules.PerformanceModule?.setPerformanceMode(true);
      }
      break;
      
    case POWER_MODES.BATTERY_SAVER:
      // Battery saving optimizations
      if (Platform.OS === 'android') {
        // Android-specific battery optimizations
        NativeModules.PerformanceModule?.setBatterySaverMode(true);
      }
      break;
      
    case POWER_MODES.BALANCED:
    default:
      // Balanced optimizations (default)
      if (Platform.OS === 'android') {
        // Reset to default mode
        NativeModules.PerformanceModule?.setBalancedMode(true);
      }
      break;
  }
};

/**
 * Start a recurring timer with power-optimized interval
 * @param {string} timerName - Name of the timer
 * @param {Function} callback - Function to call on each interval
 * @returns {number} Timer ID
 */
export const startRecurringTimer = (timerName, callback) => {
  if (!pollingIntervals[timerName]) {
    console.warn('Unknown timer name:', timerName);
    return null;
  }
  
  // Clear existing timer if any
  if (activeTimers[timerName] && activeTimers[timerName].timerId) {
    BackgroundTimer.clearInterval(activeTimers[timerName].timerId);
  }
  
  // Start new timer
  const interval = pollingIntervals[timerName];
  const timerId = BackgroundTimer.setInterval(callback, interval);
  
  // Store timer info
  activeTimers[timerName] = {
    timerId,
    callback,
    interval
  };
  
  return timerId;
};

/**
 * Stop a recurring timer
 * @param {string} timerName - Name of the timer to stop
 */
export const stopRecurringTimer = (timerName) => {
  if (activeTimers[timerName] && activeTimers[timerName].timerId) {
    BackgroundTimer.clearInterval(activeTimers[timerName].timerId);
    delete activeTimers[timerName];
  }
};

/**
 * Restart a timer with updated interval
 * @param {string} timerName - Name of the timer
 * @param {Function} callback - Function to call on each interval
 */
const restartTimer = (timerName, callback) => {
  stopRecurringTimer(timerName);
  startRecurringTimer(timerName, callback);
};

/**
 * Set lab active state
 * @param {boolean} active - Whether a lab is currently active
 */
export const setLabActiveState = (active) => {
  isLabActive = active;
  updatePollingIntervals();
  
  // Track lab state change
  analytics.trackEvent('lab_active_state_changed', {
    active,
    power_mode: currentPowerMode
  });
};

/**
 * Get battery status
 * @returns {Object} Battery status
 */
export const getBatteryStatus = () => {
  return { ...batteryStatus };
};

/**
 * Get power optimization recommendations
 * @returns {Array} List of recommendations
 */
export const getPowerOptimizationRecommendations = () => {
  const recommendations = [];
  
  // Battery level recommendations
  if (batteryStatus.level <= 0.2 && !batteryStatus.charging) {
    recommendations.push({
      id: 'low_battery',
      title: 'Low Battery',
      description: 'Your battery is low. Switch to Battery Saver mode to extend battery life.',
      action: 'Switch to Battery Saver',
      actionHandler: () => setPowerMode(POWER_MODES.BATTERY_SAVER)
    });
  }
  
  // Lab-specific recommendations
  if (isLabActive && currentPowerMode === POWER_MODES.PERFORMANCE && !batteryStatus.charging) {
    recommendations.push({
      id: 'lab_battery_usage',
      title: 'High Battery Usage',
      description: 'Lab sessions can drain your battery quickly in Performance mode.',
      action: 'Switch to Balanced Mode',
      actionHandler: () => setPowerMode(POWER_MODES.BALANCED)
    });
  }
  
  // Network recommendations
  NetInfo.fetch().then(state => {
    if (state.type === 'cellular' && isLabActive) {
      recommendations.push({
        id: 'cellular_data_usage',
        title: 'Using Cellular Data',
        description: 'Lab sessions may consume significant data on cellular networks.',
        action: 'Switch to WiFi if available',
        actionHandler: null
      });
    }
  });
  
  return recommendations;
};

export default {
  initializePowerManagement,
  setPowerMode,
  getPowerMode,
  startRecurringTimer,
  stopRecurringTimer,
  setLabActiveState,
  getBatteryStatus,
  getPowerOptimizationRecommendations,
  POWER_MODES
};
