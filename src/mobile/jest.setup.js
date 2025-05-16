/**
 * Jest setup file for Ethical Hacking LMS Mobile App
 *
 * This file contains all the mocks needed for testing the mobile app.
 */

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    /* Buttons */
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    /* Other */
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn().mockResolvedValue({ isConnected: true, isInternetReachable: true }),
  addEventListener: jest.fn(() => jest.fn()),
}));

// Mock react-native-fs
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

// Mock react-native-device-info
jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn(),
  getModel: jest.fn(),
  getVersion: jest.fn(),
  getBuildNumber: jest.fn(),
  isEmulator: jest.fn(),
}));

// Mock react-native-biometrics
jest.mock('react-native-biometrics', () => ({
  isSensorAvailable: jest.fn().mockResolvedValue({ available: true }),
  simplePrompt: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock react-native-encrypted-storage
jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  getSupportedBiometryType: jest.fn(),
  ACCESS_CONTROL: {
    BIOMETRY_ANY: 'BIOMETRY_ANY',
  },
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');

  return {
    Provider: ({ children }) => children,
    Button: ({ children, onPress, mode, ...props }) => (
      <TouchableOpacity onPress={onPress} {...props}>
        <Text>{children}</Text>
      </TouchableOpacity>
    ),
    Card: {
      Content: ({ children }) => <View>{children}</View>,
      Actions: ({ children }) => <View>{children}</View>,
      Cover: ({ source }) => <View />,
      Title: ({ children }) => <Text>{children}</Text>,
    },
    Title: ({ children, ...props }) => <Text {...props}>{children}</Text>,
    Paragraph: ({ children, ...props }) => <Text {...props}>{children}</Text>,
    Text: ({ children, ...props }) => <Text {...props}>{children}</Text>,
    Chip: ({ children, ...props }) => (
      <View {...props}>
        <Text>{children}</Text>
      </View>
    ),
    ActivityIndicator: ({ size, color }) => <View />,
    Appbar: {
      Header: ({ children }) => <View>{children}</View>,
      Content: ({ title }) => <Text>{title}</Text>,
      Action: ({ icon, onPress }) => (
        <TouchableOpacity onPress={onPress}>
          <Text>{icon}</Text>
        </TouchableOpacity>
      ),
      BackAction: ({ onPress }) => (
        <TouchableOpacity onPress={onPress}>
          <Text>Back</Text>
        </TouchableOpacity>
      ),
    },
    Divider: () => <View style={{ height: 1, backgroundColor: '#e0e0e0' }} />,
    ProgressBar: ({ progress, color }) => (
      <View style={{ height: 4, backgroundColor: '#e0e0e0' }}>
        <View
          style={{
            height: '100%',
            width: `${progress * 100}%`,
            backgroundColor: color,
          }}
        />
      </View>
    ),
    Searchbar: ({ placeholder, onChangeText, value }) => (
      <View>
        <Text>{placeholder}</Text>
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Text>Clear</Text>
        </TouchableOpacity>
      </View>
    ),
    List: {
      Item: ({ title, description, onPress }) => (
        <TouchableOpacity onPress={onPress}>
          <Text>{title}</Text>
          {description && <Text>{description}</Text>}
        </TouchableOpacity>
      ),
      Accordion: ({ title, children, expanded, onPress }) => (
        <View>
          <TouchableOpacity onPress={onPress}>
            <Text>{title}</Text>
          </TouchableOpacity>
          {expanded && children}
        </View>
      ),
    },
    Avatar: {
      Text: ({ label, size }) => (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#ccc',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>{label}</Text>
        </View>
      ),
    },
    IconButton: ({ icon, onPress }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{icon}</Text>
      </TouchableOpacity>
    ),
    useTheme: () => ({
      colors: {
        primary: '#1976d2',
        accent: '#f50057',
        background: '#f5f5f5',
        surface: '#ffffff',
        text: '#000000',
        disabled: '#9e9e9e',
        placeholder: '#9e9e9e',
        backdrop: 'rgba(0, 0, 0, 0.5)',
        notification: '#f50057',
      },
    }),
  };
});

// Mock @react-navigation
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
    }),
    useRoute: () => ({
      params: {
        courseId: '1',
        lessonId: '1',
        labId: '1',
      },
    }),
    useIsFocused: () => true,
    useFocusEffect: jest.fn(),
    createNavigatorFactory: jest.fn(),
    NavigationContainer: ({ children }) => children,
  };
});

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

jest.mock('@react-navigation/drawer', () => ({
  createDrawerNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
  return {
    get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
});

// Mock Keyboard
jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => {
  return {
    dismiss: jest.fn(),
  };
});

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));
