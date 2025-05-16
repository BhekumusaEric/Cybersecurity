/**
 * Responsive Layout Utilities
 * 
 * Provides utilities for creating responsive layouts that work across
 * different device sizes, orientations, and platforms.
 */

import { Dimensions, Platform, PixelRatio, StatusBar } from 'react-native';

// Device type detection
export const DEVICE_TYPES = {
  PHONE: 'phone',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
};

// Orientation types
export const ORIENTATIONS = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape'
};

// Get window dimensions
const getWindowDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

// Get screen dimensions
const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('screen');
  return { width, height };
};

// Determine if device is a tablet
export const isTablet = () => {
  const { width, height } = getScreenDimensions();
  const screenSize = Math.sqrt(width * width + height * height);
  
  // iOS specific check
  if (Platform.OS === 'ios') {
    return Platform.isPad;
  }
  
  // Android check based on screen size
  return screenSize >= 1000;
};

// Get current device type
export const getDeviceType = () => {
  if (isTablet()) {
    return DEVICE_TYPES.TABLET;
  }
  
  return DEVICE_TYPES.PHONE;
};

// Get current orientation
export const getOrientation = () => {
  const { width, height } = getWindowDimensions();
  return width > height ? ORIENTATIONS.LANDSCAPE : ORIENTATIONS.PORTRAIT;
};

// Base scale for responsive sizing
const scale = () => {
  const { width } = getWindowDimensions();
  
  // Different base width depending on device type
  const baseWidth = isTablet() ? 768 : 375;
  
  return width / baseWidth;
};

// Normalize font size across different screen sizes
export const normalizeFont = (size) => {
  const deviceType = getDeviceType();
  
  // Different scaling for tablets vs phones
  if (deviceType === DEVICE_TYPES.TABLET) {
    // Less aggressive scaling for tablets
    const scaleFactor = 0.7;
    return Math.round(size * scale() * scaleFactor);
  }
  
  // More precise scaling for phones
  const newSize = size * scale();
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Calculate responsive width based on percentage
export const widthPercentage = (percentage) => {
  const { width } = getWindowDimensions();
  return (percentage * width) / 100;
};

// Calculate responsive height based on percentage
export const heightPercentage = (percentage) => {
  const { height } = getWindowDimensions();
  return (percentage * height) / 100;
};

// Calculate responsive size (for both width and height)
export const responsiveSize = (size) => {
  const deviceType = getDeviceType();
  
  if (deviceType === DEVICE_TYPES.TABLET) {
    // Less aggressive scaling for tablets
    return size * Math.min(scale(), 1.2);
  }
  
  return size * scale();
};

// Get status bar height
export const getStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    return isIphoneX() ? 44 : 20;
  }
  
  return StatusBar.currentHeight || 0;
};

// Check if device is iPhone X or newer (with notch)
export const isIphoneX = () => {
  if (Platform.OS !== 'ios') return false;
  
  const { height, width } = getScreenDimensions();
  
  return (
    (width === 375 && height === 812) || // iPhone X, XS, 11 Pro, 12 mini
    (width === 414 && height === 896) || // iPhone XR, XS Max, 11, 11 Pro Max
    (width === 390 && height === 844) || // iPhone 12, 12 Pro, 13, 13 Pro
    (width === 428 && height === 926) || // iPhone 12 Pro Max, 13 Pro Max
    (width === 393 && height === 852) || // iPhone 14, 14 Pro
    (width === 430 && height === 932)    // iPhone 14 Pro Max
  );
};

// Get bottom space for iPhone X and newer
export const getBottomSpace = () => {
  return isIphoneX() ? 34 : 0;
};

// Get grid columns based on device type and orientation
export const getGridColumns = () => {
  const deviceType = getDeviceType();
  const orientation = getOrientation();
  
  if (deviceType === DEVICE_TYPES.TABLET) {
    return orientation === ORIENTATIONS.LANDSCAPE ? 4 : 3;
  }
  
  return orientation === ORIENTATIONS.LANDSCAPE ? 3 : 2;
};

// Calculate item width for grid layouts
export const getGridItemWidth = (spacing = 10) => {
  const { width } = getWindowDimensions();
  const columns = getGridColumns();
  
  // Account for spacing between items
  const totalSpacing = spacing * (columns + 1);
  return (width - totalSpacing) / columns;
};

// Get appropriate layout based on device type and orientation
export const getLayoutStyle = () => {
  const deviceType = getDeviceType();
  const orientation = getOrientation();
  
  // Base styles
  const baseStyles = {
    container: {
      flex: 1,
      paddingHorizontal: deviceType === DEVICE_TYPES.TABLET ? 20 : 16
    },
    content: {
      paddingBottom: getBottomSpace() + 20
    }
  };
  
  // Tablet-specific styles
  if (deviceType === DEVICE_TYPES.TABLET) {
    if (orientation === ORIENTATIONS.LANDSCAPE) {
      // Landscape tablet
      return {
        ...baseStyles,
        container: {
          ...baseStyles.container,
          paddingHorizontal: 32,
          maxWidth: 1024,
          alignSelf: 'center',
          width: '100%'
        },
        splitView: {
          flexDirection: 'row'
        },
        sidebar: {
          width: 320,
          marginRight: 24
        },
        mainContent: {
          flex: 1
        }
      };
    } else {
      // Portrait tablet
      return {
        ...baseStyles,
        container: {
          ...baseStyles.container,
          paddingHorizontal: 24,
          maxWidth: 768,
          alignSelf: 'center',
          width: '100%'
        },
        splitView: {
          flexDirection: 'column'
        },
        sidebar: {
          width: '100%',
          marginBottom: 24
        },
        mainContent: {
          flex: 1
        }
      };
    }
  }
  
  // Phone-specific styles
  if (orientation === ORIENTATIONS.LANDSCAPE) {
    // Landscape phone
    return {
      ...baseStyles,
      container: {
        ...baseStyles.container,
        paddingHorizontal: 20
      },
      splitView: {
        flexDirection: 'row'
      },
      sidebar: {
        width: 240,
        marginRight: 16
      },
      mainContent: {
        flex: 1
      }
    };
  } else {
    // Portrait phone (default)
    return {
      ...baseStyles,
      splitView: {
        flexDirection: 'column'
      },
      sidebar: {
        width: '100%',
        marginBottom: 16
      },
      mainContent: {
        flex: 1
      }
    };
  }
};

// Create responsive styles based on device type
export const createResponsiveStyles = (phoneStyles, tabletStyles) => {
  const deviceType = getDeviceType();
  
  if (deviceType === DEVICE_TYPES.TABLET && tabletStyles) {
    return { ...phoneStyles, ...tabletStyles };
  }
  
  return phoneStyles;
};

// Listen for dimension changes
export const useDimensionsChange = (callback) => {
  Dimensions.addEventListener('change', ({ window }) => {
    const { width, height } = window;
    const orientation = width > height ? ORIENTATIONS.LANDSCAPE : ORIENTATIONS.PORTRAIT;
    
    if (callback) {
      callback({
        width,
        height,
        orientation,
        deviceType: getDeviceType()
      });
    }
  });
};

// Get safe area insets
export const getSafeAreaInsets = () => {
  return {
    top: Platform.OS === 'ios' ? (isIphoneX() ? 44 : 20) : StatusBar.currentHeight || 0,
    bottom: getBottomSpace(),
    left: 0,
    right: 0
  };
};

// Get appropriate font size based on device type
export const getFontSize = (size, tabletMultiplier = 1.2) => {
  const deviceType = getDeviceType();
  
  if (deviceType === DEVICE_TYPES.TABLET) {
    return normalizeFont(size * tabletMultiplier);
  }
  
  return normalizeFont(size);
};

// Get appropriate spacing based on device type
export const getSpacing = (size, tabletMultiplier = 1.5) => {
  const deviceType = getDeviceType();
  
  if (deviceType === DEVICE_TYPES.TABLET) {
    return responsiveSize(size * tabletMultiplier);
  }
  
  return responsiveSize(size);
};

// Export all utilities
export default {
  DEVICE_TYPES,
  ORIENTATIONS,
  isTablet,
  getDeviceType,
  getOrientation,
  normalizeFont,
  widthPercentage,
  heightPercentage,
  responsiveSize,
  getStatusBarHeight,
  isIphoneX,
  getBottomSpace,
  getGridColumns,
  getGridItemWidth,
  getLayoutStyle,
  createResponsiveStyles,
  useDimensionsChange,
  getSafeAreaInsets,
  getFontSize,
  getSpacing
};
