/**
 * Enhanced Video Player Component
 * 
 * A robust video player component that handles device rotation,
 * network changes, and provides a consistent experience across platforms.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  Platform,
  AppState
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '@react-navigation/native';
import analytics from '../../utils/analytics';

// Format time in MM:SS format
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const VideoPlayer = ({
  source,
  title,
  poster,
  autoplay = false,
  onComplete,
  onError,
  startPosition = 0,
  courseId,
  moduleId,
  lessonId
}) => {
  const { colors } = useTheme();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(startPosition);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [networkQuality, setNetworkQuality] = useState(null);
  const [videoQuality, setVideoQuality] = useState('auto');
  const controlsTimeoutRef = useRef(null);
  const lastPositionRef = useRef(startPosition);
  const appStateRef = useRef(AppState.currentState);
  const playerStateRef = useRef({
    isPlaying,
    currentTime: startPosition,
    isFullscreen
  });
  
  // Update player state ref when state changes
  useEffect(() => {
    playerStateRef.current = {
      isPlaying,
      currentTime,
      isFullscreen
    };
  }, [isPlaying, currentTime, isFullscreen]);
  
  // Handle device orientation changes
  useEffect(() => {
    const handleOrientationChange = (orientation) => {
      // Only respond to device orientation if we're not manually controlling fullscreen
      if (!playerStateRef.current.isFullscreen) {
        if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
          enterFullscreen();
        } else if (orientation === 'PORTRAIT') {
          exitFullscreen();
        }
      }
    };
    
    // Listen for orientation changes
    Orientation.addOrientationListener(handleOrientationChange);
    
    // Initial check
    Orientation.getOrientation((orientation) => {
      if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
        enterFullscreen();
      }
    });
    
    // Track video view
    analytics.trackEvent('video_view_started', {
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      video_title: title,
      fullscreen: isFullscreen
    });
    
    // Clean up
    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
      if (isFullscreen) {
        Orientation.lockToPortrait();
      }
      
      // Track video view ended
      analytics.trackEvent('video_view_ended', {
        course_id: courseId,
        module_id: moduleId,
        lesson_id: lessonId,
        video_title: title,
        watched_seconds: lastPositionRef.current,
        watched_percent: duration > 0 ? Math.round((lastPositionRef.current / duration) * 100) : 0,
        completed: lastPositionRef.current > 0 && duration > 0 && (lastPositionRef.current / duration) > 0.9
      });
    };
  }, []);
  
  // Monitor network quality
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkQuality(state);
      
      // Adjust video quality based on network type
      if (state.type === 'cellular' && state.details?.cellularGeneration === '3g') {
        setVideoQuality('low');
      } else if (state.type === 'cellular' && state.details?.cellularGeneration === '4g') {
        setVideoQuality('medium');
      } else if (state.type === 'wifi' && state.isConnected) {
        setVideoQuality('high');
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App is going to background
        if (playerStateRef.current.isPlaying) {
          // Pause video and save position
          setIsPlaying(false);
          lastPositionRef.current = playerStateRef.current.currentTime;
        }
      } else if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App is coming to foreground
        // Don't auto-resume to avoid unexpected audio
      }
      
      appStateRef.current = nextAppState;
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Auto-hide controls after a delay
  useEffect(() => {
    if (controlsVisible && isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [controlsVisible, isPlaying]);
  
  // Enter fullscreen mode
  const enterFullscreen = () => {
    setIsFullscreen(true);
    if (Platform.OS === 'android') {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToLandscapeRight();
    }
    
    // Track fullscreen event
    analytics.trackEvent('video_fullscreen_entered', {
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      video_title: title
    });
  };
  
  // Exit fullscreen mode
  const exitFullscreen = () => {
    setIsFullscreen(false);
    Orientation.lockToPortrait();
    
    // Track exit fullscreen event
    analytics.trackEvent('video_fullscreen_exited', {
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      video_title: title
    });
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // Track play/pause event
    analytics.trackEvent(isPlaying ? 'video_paused' : 'video_played', {
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      video_title: title,
      position: currentTime,
      position_percent: duration > 0 ? Math.round((currentTime / duration) * 100) : 0
    });
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };
  
  // Handle video load start
  const handleLoadStart = () => {
    setIsBuffering(true);
    setError(null);
  };
  
  // Handle video ready
  const handleReady = (data) => {
    setIsBuffering(false);
    setDuration(data.duration);
    
    // Seek to start position if needed
    if (startPosition > 0 && videoRef.current) {
      videoRef.current.seek(startPosition);
    }
  };
  
  // Handle progress updates
  const handleProgress = (data) => {
    setCurrentTime(data.currentTime);
    lastPositionRef.current = data.currentTime;
    
    // Check if video is complete (>90% watched)
    if (data.currentTime > 0 && duration > 0 && (data.currentTime / duration) > 0.9) {
      if (onComplete) {
        onComplete(data.currentTime);
      }
    }
  };
  
  // Handle video end
  const handleEnd = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
    
    // Track completion
    analytics.trackEvent('video_completed', {
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      video_title: title,
      duration: duration
    });
    
    if (onComplete) {
      onComplete(duration);
    }
  };
  
  // Handle video errors
  const handleError = (error) => {
    console.error('Video playback error:', error);
    setError(error);
    setIsBuffering(false);
    setIsPlaying(false);
    
    // Track error
    analytics.trackEvent('video_error', {
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      video_title: title,
      error: error.error?.errorString || 'Unknown error',
      position: currentTime
    });
    
    if (onError) {
      onError(error);
    }
  };
  
  // Handle seeking
  const handleSeek = (value) => {
    if (videoRef.current) {
      videoRef.current.seek(value);
    }
    setCurrentTime(value);
    
    // Track seek event
    analytics.trackEvent('video_seek', {
      course_id: courseId,
      module_id: moduleId,
      lesson_id: lessonId,
      video_title: title,
      from_position: lastPositionRef.current,
      to_position: value
    });
  };
  
  // Toggle controls visibility
  const toggleControls = () => {
    setControlsVisible(!controlsVisible);
  };
  
  // Restart video after error
  const handleRetry = () => {
    setError(null);
    setIsBuffering(true);
    
    // Small delay before retrying
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.seek(0);
        setIsPlaying(true);
      }
    }, 500);
  };
  
  // Render loading indicator
  const renderBuffering = () => {
    if (isBuffering) {
      return (
        <View style={styles.bufferingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    return null;
  };
  
  // Render error message
  const renderError = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={50} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error.error?.errorString || 'Failed to load video'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };
  
  // Render video controls
  const renderControls = () => {
    if (!controlsVisible && isPlaying && !isBuffering) {
      return null;
    }
    
    return (
      <View style={[
        styles.controlsContainer,
        isFullscreen ? styles.fullscreenControls : null
      ]}>
        {/* Top controls */}
        <View style={styles.topControls}>
          <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
          <TouchableOpacity onPress={toggleFullscreen}>
            <Icon 
              name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Center play/pause button */}
        <TouchableOpacity style={styles.centerButton} onPress={togglePlayPause}>
          <Icon 
            name={isPlaying ? 'pause' : 'play-arrow'} 
            size={isFullscreen ? 60 : 40} 
            color={colors.text} 
          />
        </TouchableOpacity>
        
        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <Text style={[styles.timeText, { color: colors.text }]}>
            {formatTime(currentTime)}
          </Text>
          
          <Slider
            style={styles.progressSlider}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onValueChange={handleSeek}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
          
          <Text style={[styles.timeText, { color: colors.text }]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>
    );
  };
  
  // Get video resolution based on quality setting
  const getVideoResolution = () => {
    if (!source.quality) {
      return source;
    }
    
    switch (videoQuality) {
      case 'low':
        return source.quality.low || source.quality.medium || source.quality.high || source;
      case 'medium':
        return source.quality.medium || source.quality.high || source.quality.low || source;
      case 'high':
      case 'auto':
      default:
        return source.quality.high || source.quality.medium || source.quality.low || source;
    }
  };
  
  return (
    <View style={[
      styles.container,
      isFullscreen ? styles.fullscreenContainer : null
    ]}>
      <TouchableOpacity 
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={toggleControls}
      >
        <Video
          ref={videoRef}
          source={getVideoResolution()}
          style={styles.video}
          poster={poster}
          posterResizeMode="cover"
          resizeMode="contain"
          paused={!isPlaying}
          onLoadStart={handleLoadStart}
          onLoad={handleReady}
          onProgress={handleProgress}
          onEnd={handleEnd}
          onError={handleError}
          repeat={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          bufferConfig={{
            minBufferMs: 15000,
            maxBufferMs: 50000,
            bufferForPlaybackMs: 2500,
            bufferForPlaybackAfterRebufferMs: 5000
          }}
        />
        
        {renderBuffering()}
        {renderError()}
        {renderControls()}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    aspectRatio: 16 / 9
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    aspectRatio: undefined
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  bufferingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  retryText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
    padding: 10
  },
  fullscreenControls: {
    padding: 20
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10
  },
  centerButton: {
    alignSelf: 'center'
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timeText: {
    fontSize: 12,
    marginHorizontal: 5
  },
  progressSlider: {
    flex: 1,
    height: 40
  }
});

export default VideoPlayer;
