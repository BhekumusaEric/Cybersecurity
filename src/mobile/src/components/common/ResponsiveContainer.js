/**
 * Responsive Container Component
 * 
 * A container component that adapts to different screen sizes and orientations.
 * Use this as the base container for screens to ensure consistent layout across devices.
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import responsiveLayout from '../../utils/responsiveLayout';

const ResponsiveContainer = ({
  children,
  style,
  scrollable = false,
  keyboardAvoiding = false,
  contentContainerStyle,
  safeArea = true,
  centerContent = false,
  splitView = false,
  sidebar = null,
  sidebarPosition = 'left',
  sidebarWidth,
  maxWidth,
  backgroundColor,
  onLayout,
  refreshControl,
  scrollViewRef,
  ...props
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [orientation, setOrientation] = useState(
    dimensions.width > dimensions.height 
      ? responsiveLayout.ORIENTATIONS.LANDSCAPE 
      : responsiveLayout.ORIENTATIONS.PORTRAIT
  );
  const deviceType = responsiveLayout.getDeviceType();
  
  // Update dimensions and orientation on change
  useEffect(() => {
    const handleDimensionsChange = ({ window }) => {
      setDimensions(window);
      setOrientation(
        window.width > window.height 
          ? responsiveLayout.ORIENTATIONS.LANDSCAPE 
          : responsiveLayout.ORIENTATIONS.PORTRAIT
      );
    };
    
    const subscription = Dimensions.addEventListener('change', handleDimensionsChange);
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Determine if we should use split view layout
  const useSplitView = splitView && sidebar && (
    deviceType === responsiveLayout.DEVICE_TYPES.TABLET || 
    orientation === responsiveLayout.ORIENTATIONS.LANDSCAPE
  );
  
  // Get appropriate padding based on safe area
  const getSafeAreaPadding = () => {
    if (!safeArea) return {};
    
    return {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right
    };
  };
  
  // Get container style based on device and orientation
  const getContainerStyle = () => {
    const layoutStyle = responsiveLayout.getLayoutStyle();
    
    let containerStyle = {
      ...layoutStyle.container,
      backgroundColor: backgroundColor || colors.background,
      ...getSafeAreaPadding()
    };
    
    // Apply max width if specified
    if (maxWidth) {
      containerStyle = {
        ...containerStyle,
        maxWidth,
        alignSelf: 'center',
        width: '100%'
      };
    }
    
    // Center content if specified
    if (centerContent) {
      containerStyle = {
        ...containerStyle,
        justifyContent: 'center',
        alignItems: 'center'
      };
    }
    
    return containerStyle;
  };
  
  // Render content based on configuration
  const renderContent = () => {
    const content = (
      <View 
        style={[
          styles.contentContainer,
          contentContainerStyle
        ]}
        {...props}
      >
        {children}
      </View>
    );
    
    if (scrollable) {
      return (
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollViewContent,
            centerContent && styles.centerContent,
            contentContainerStyle
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
          {...props}
        >
          {content}
        </ScrollView>
      );
    }
    
    return content;
  };
  
  // Render split view layout
  const renderSplitView = () => {
    const isLandscape = orientation === responsiveLayout.ORIENTATIONS.LANDSCAPE;
    const isTablet = deviceType === responsiveLayout.DEVICE_TYPES.TABLET;
    
    // Determine sidebar width
    const actualSidebarWidth = sidebarWidth || (
      isTablet 
        ? (isLandscape ? 320 : '100%')
        : (isLandscape ? 240 : '100%')
    );
    
    // Determine flex direction
    const flexDirection = (
      (isTablet && isLandscape) || 
      (!isTablet && isLandscape)
    ) ? 'row' : 'column';
    
    // Swap sidebar position if needed
    const sidebarFirst = sidebarPosition === 'left' || flexDirection === 'column';
    
    return (
      <View 
        style={[
          styles.splitContainer,
          { flexDirection }
        ]}
      >
        {sidebarFirst ? (
          <>
            <View 
              style={[
                styles.sidebar,
                { 
                  width: actualSidebarWidth,
                  marginRight: flexDirection === 'row' ? 24 : 0,
                  marginBottom: flexDirection === 'column' ? 24 : 0
                }
              ]}
            >
              {sidebar}
            </View>
            <View style={styles.mainContent}>
              {renderContent()}
            </View>
          </>
        ) : (
          <>
            <View style={styles.mainContent}>
              {renderContent()}
            </View>
            <View 
              style={[
                styles.sidebar,
                { 
                  width: actualSidebarWidth,
                  marginLeft: flexDirection === 'row' ? 24 : 0,
                  marginTop: flexDirection === 'column' ? 24 : 0
                }
              ]}
            >
              {sidebar}
            </View>
          </>
        )}
      </View>
    );
  };
  
  // Wrap with KeyboardAvoidingView if needed
  const renderWithKeyboardAvoiding = (content) => {
    if (keyboardAvoiding) {
      return (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {content}
        </KeyboardAvoidingView>
      );
    }
    
    return content;
  };
  
  return (
    <View 
      style={[
        getContainerStyle(),
        style
      ]}
      onLayout={onLayout}
    >
      {renderWithKeyboardAvoiding(
        useSplitView ? renderSplitView() : renderContent()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    width: '100%'
  },
  scrollView: {
    flex: 1,
    width: '100%'
  },
  scrollViewContent: {
    flexGrow: 1
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    flex: 1,
    width: '100%'
  },
  splitContainer: {
    flex: 1,
    width: '100%'
  },
  sidebar: {
    overflow: 'hidden'
  },
  mainContent: {
    flex: 1
  }
});

export default ResponsiveContainer;
