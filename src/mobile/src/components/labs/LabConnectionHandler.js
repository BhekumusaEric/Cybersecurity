/**
 * Lab Connection Handler Component
 * 
 * Handles the UI for lab environment connection, including loading states,
 * error handling, and retry mechanisms.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressBar from '../common/ProgressBar';
import ErrorView from '../common/ErrorView';
import labService from '../../services/labService';
import analytics from '../../utils/analytics';

// Connection states
const CONNECTION_STATES = {
  IDLE: 'idle',
  CHECKING_NETWORK: 'checking_network',
  PROVISIONING: 'provisioning',
  WAITING: 'waiting',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
  RETRY: 'retry'
};

// Progress steps for lab provisioning
const PROGRESS_STEPS = [
  { key: 'network', label: 'Checking network connection', percentage: 10 },
  { key: 'provision', label: 'Provisioning lab environment', percentage: 30 },
  { key: 'waiting', label: 'Waiting for lab to initialize', percentage: 60 },
  { key: 'connecting', label: 'Establishing secure connection', percentage: 80 },
  { key: 'finalizing', label: 'Finalizing lab setup', percentage: 90 },
  { key: 'connected', label: 'Connected to lab environment', percentage: 100 }
];

const LabConnectionHandler = ({ 
  labId, 
  onConnected, 
  onError, 
  options = {} 
}) => {
  const { colors } = useTheme();
  const [connectionState, setConnectionState] = useState(CONNECTION_STATES.IDLE);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [networkQuality, setNetworkQuality] = useState(null);
  const [showSlowNetworkWarning, setShowSlowNetworkWarning] = useState(false);
  
  // Check network quality
  const checkNetwork = useCallback(async () => {
    setConnectionState(CONNECTION_STATES.CHECKING_NETWORK);
    setCurrentStep(0);
    setProgress(PROGRESS_STEPS[0].percentage);
    
    try {
      const netInfo = await NetInfo.fetch();
      
      if (!netInfo.isConnected) {
        throw new Error('No network connection available');
      }
      
      // Test network latency
      const startTime = Date.now();
      await fetch('https://api.ethicalhackinglms.com/ping');
      const latency = Date.now() - startTime;
      
      const quality = {
        isConnected: netInfo.isConnected,
        type: netInfo.type,
        isSlowConnection: latency > 300,
        latency
      };
      
      setNetworkQuality(quality);
      
      // Show warning for slow connections
      if (quality.isSlowConnection) {
        setShowSlowNetworkWarning(true);
      }
      
      return quality;
    } catch (error) {
      console.error('Network check failed:', error);
      setError({
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        actionLabel: 'Retry',
        action: () => startLabConnection()
      });
      setConnectionState(CONNECTION_STATES.ERROR);
      throw error;
    }
  }, []);
  
  // Start lab connection process
  const startLabConnection = useCallback(async () => {
    setError(null);
    
    try {
      // Step 1: Check network
      await checkNetwork();
      
      // Step 2: Provision lab
      setConnectionState(CONNECTION_STATES.PROVISIONING);
      setCurrentStep(1);
      setProgress(PROGRESS_STEPS[1].percentage);
      
      const labSession = await labService.provisionLab(labId, options);
      setSessionId(labSession.sessionId);
      
      // Step 3: Wait for lab to initialize
      setConnectionState(CONNECTION_STATES.WAITING);
      setCurrentStep(2);
      setProgress(PROGRESS_STEPS[2].percentage);
      
      // Poll lab status until it's ready
      const finalStatus = await labService.pollLabStatus(
        labSession.sessionId,
        (status) => {
          // Update progress based on provisioning status
          if (status.progress) {
            const waitingProgress = PROGRESS_STEPS[2].percentage + 
              ((PROGRESS_STEPS[3].percentage - PROGRESS_STEPS[2].percentage) * (status.progress / 100));
            setProgress(waitingProgress);
          }
        }
      );
      
      if (finalStatus.status === labService.LAB_STATUS.ERROR) {
        throw new Error(finalStatus.error || 'Lab provisioning failed');
      }
      
      // Step 4: Connect to lab
      setConnectionState(CONNECTION_STATES.CONNECTING);
      setCurrentStep(3);
      setProgress(PROGRESS_STEPS[3].percentage);
      
      const connectionConfig = await labService.connectToLab(labSession);
      
      // Step 5: Finalize setup
      setCurrentStep(4);
      setProgress(PROGRESS_STEPS[4].percentage);
      
      // Short delay to show progress
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 6: Connected
      setConnectionState(CONNECTION_STATES.CONNECTED);
      setCurrentStep(5);
      setProgress(PROGRESS_STEPS[5].percentage);
      
      // Track successful connection
      analytics.trackEvent('lab_connection_complete', {
        lab_id: labId,
        session_id: labSession.sessionId,
        connection_type: connectionConfig.connectionType,
        duration_ms: Date.now() - startTime
      });
      
      // Notify parent component
      if (onConnected) {
        onConnected(connectionConfig);
      }
    } catch (error) {
      console.error('Lab connection failed:', error);
      
      // Track connection failure
      analytics.trackEvent('lab_connection_failed', {
        lab_id: labId,
        error: error.message,
        state: connectionState,
        retry_count: retryCount
      });
      
      // Set appropriate error message based on error type
      let errorMessage = 'Failed to connect to lab environment. Please try again.';
      let actionLabel = 'Retry';
      let action = () => {
        setRetryCount(retryCount + 1);
        startLabConnection();
      };
      
      if (error.message?.includes('network')) {
        errorMessage = 'Network connection issue. Please check your internet connection and try again.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Connection timed out. This may be due to slow network conditions.';
      } else if (error.message?.includes('provisioning')) {
        errorMessage = 'Lab environment is currently unavailable. Please try again later.';
      }
      
      setError({
        title: 'Connection Failed',
        message: errorMessage,
        actionLabel,
        action
      });
      
      setConnectionState(CONNECTION_STATES.ERROR);
      
      // Notify parent component
      if (onError) {
        onError(error);
      }
    }
  }, [labId, options, retryCount, checkNetwork, onConnected, onError]);
  
  // Start connection when component mounts
  useEffect(() => {
    const startTime = Date.now();
    startLabConnection();
    
    // Set up event listeners for lab connection events
    const slowNetworkListener = global.EventEmitter.addListener(
      'SLOW_NETWORK_WARNING',
      (data) => {
        if (data.labId === labId) {
          setShowSlowNetworkWarning(true);
        }
      }
    );
    
    const retryListener = global.EventEmitter.addListener(
      'LAB_PROVISION_RETRY',
      (data) => {
        if (data.labId === labId) {
          setConnectionState(CONNECTION_STATES.RETRY);
          setError({
            title: 'Retrying Connection',
            message: `Attempt ${data.attempt} of ${data.maxRetries}. Please wait...`,
            actionLabel: null
          });
          
          // After retry delay, update state
          setTimeout(() => {
            if (connectionState === CONNECTION_STATES.RETRY) {
              setConnectionState(CONNECTION_STATES.PROVISIONING);
              setError(null);
            }
          }, data.delay);
        }
      }
    );
    
    // Cleanup
    return () => {
      slowNetworkListener.remove();
      retryListener.remove();
      
      // If we have a session ID and we're not connected, terminate the lab
      if (sessionId && connectionState !== CONNECTION_STATES.CONNECTED) {
        labService.terminateLab(sessionId).catch(err => {
          console.error('Failed to terminate lab:', err);
        });
      }
    };
  }, [labId, startLabConnection]);
  
  // Render slow network warning
  const renderSlowNetworkWarning = () => {
    if (!showSlowNetworkWarning) return null;
    
    return (
      <View style={styles.warningContainer}>
        <Icon name="wifi-strength-1-alert" size={24} color={colors.warning} />
        <Text style={[styles.warningText, { color: colors.text }]}>
          Slow network detected. Lab connection may take longer than usual.
        </Text>
        <TouchableOpacity 
          onPress={() => setShowSlowNetworkWarning(false)}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Icon name="close" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    );
  };
  
  // Render based on connection state
  const renderContent = () => {
    switch (connectionState) {
      case CONNECTION_STATES.ERROR:
        return (
          <ErrorView
            title={error?.title || 'Connection Error'}
            message={error?.message || 'An unexpected error occurred.'}
            actionLabel={error?.actionLabel}
            onAction={error?.action}
          />
        );
        
      case CONNECTION_STATES.RETRY:
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.statusText, { color: colors.text }]}>
              {error?.message || 'Retrying connection...'}
            </Text>
          </View>
        );
        
      case CONNECTION_STATES.CONNECTED:
        return (
          <View style={styles.container}>
            <Icon name="check-circle" size={60} color={colors.success} />
            <Text style={[styles.statusText, { color: colors.text }]}>
              Connected to lab environment
            </Text>
          </View>
        );
        
      default:
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.statusText, { color: colors.text }]}>
              {PROGRESS_STEPS[currentStep]?.label || 'Connecting to lab...'}
            </Text>
            <ProgressBar 
              progress={progress} 
              width={250} 
              color={colors.primary} 
            />
          </View>
        );
    }
  };
  
  return (
    <View style={styles.wrapper}>
      {renderSlowNetworkWarning()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusText: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center'
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 204, 0, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20
  },
  warningText: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14
  }
});

export default LabConnectionHandler;
