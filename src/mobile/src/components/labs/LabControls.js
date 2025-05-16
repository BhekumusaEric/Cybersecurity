import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LabControls = ({ status, onStart, onStop, onReset, isOnline, isDownloaded }) => {
  // Render different controls based on lab status
  const renderControls = () => {
    switch (status) {
      case 'loading':
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" style={styles.loadingIndicator} />
            <Text style={styles.loadingText}>
              {status === 'loading' ? 'Loading lab environment...' : 'Stopping lab environment...'}
            </Text>
          </View>
        );
        
      case 'running':
        return (
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={onStop}
            >
              <Icon name="stop" size={24} color="#fff" />
              <Text style={styles.controlText}>Stop</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, styles.resetButton]}
              onPress={onReset}
            >
              <Icon name="refresh" size={24} color="#fff" />
              <Text style={styles.controlText}>Reset</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'stopped':
      default:
        return (
          <View style={styles.startContainer}>
            <Button
              mode="contained"
              icon="play"
              onPress={onStart}
              disabled={!isOnline && !isDownloaded}
              style={styles.startButton}
              contentStyle={styles.startButtonContent}
              labelStyle={styles.startButtonLabel}
            >
              Start Lab
            </Button>
            
            {!isOnline && !isDownloaded && (
              <Text style={styles.offlineWarning}>
                This lab is not available offline. Connect to the internet or download it for offline use.
              </Text>
            )}
          </View>
        );
    }
  };
  
  return (
    <View style={styles.container}>
      {renderControls()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1976d2',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  loadingIndicator: {
    marginRight: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  resetButton: {
    backgroundColor: '#ff9800',
  },
  controlText: {
    color: '#fff',
    marginTop: 4,
    fontWeight: '500',
  },
  startContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  startButton: {
    width: '80%',
    borderRadius: 8,
  },
  startButtonContent: {
    height: 48,
  },
  startButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  offlineWarning: {
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default LabControls;
