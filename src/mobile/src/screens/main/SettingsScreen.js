import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import {
  Text,
  Appbar,
  List,
  Switch,
  Divider,
  Button,
  Dialog,
  Portal,
  RadioButton,
  Paragraph,
  Title,
  Subheading,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import { useNotification } from '../../context/NotificationContext';

const SettingsScreen = ({ navigation }) => {
  const { biometricsAvailable, enableBiometricLogin, disableBiometricLogin } = useAuth();
  const { theme, themeMode, setTheme } = useTheme();
  const { isOnline } = useOffline();
  const { permissionStatus, requestPermissions, openNotificationSettings } = useNotification();
  
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(permissionStatus === 'granted');
  const [offlineDownloadsEnabled, setOfflineDownloadsEnabled] = useState(true);
  const [autoPlayVideos, setAutoPlayVideos] = useState(true);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [showFontSizeDialog, setShowFontSizeDialog] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themeMode);
  
  // Check if biometrics are enabled
  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        // This would be a real check in production
        setBiometricsEnabled(biometricsAvailable);
      } catch (error) {
        console.log('Check biometrics error:', error);
      }
    };
    
    checkBiometrics();
  }, [biometricsAvailable]);
  
  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load auto-play setting
        const autoPlay = await AsyncStorage.getItem('autoPlayVideos');
        if (autoPlay !== null) {
          setAutoPlayVideos(autoPlay === 'true');
        }
        
        // Load font size setting
        const fontSize = await AsyncStorage.getItem('fontSizeMultiplier');
        if (fontSize !== null) {
          setFontSizeMultiplier(parseFloat(fontSize));
        }
        
        // Load offline downloads setting
        const offlineDownloads = await AsyncStorage.getItem('offlineDownloadsEnabled');
        if (offlineDownloads !== null) {
          setOfflineDownloadsEnabled(offlineDownloads === 'true');
        }
      } catch (error) {
        console.log('Load settings error:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // Handle biometrics toggle
  const handleBiometricsToggle = async (value) => {
    try {
      if (value) {
        // Enable biometrics
        const success = await enableBiometricLogin('user@example.com', 'password123'); // In a real app, you'd use the actual credentials
        
        if (success) {
          setBiometricsEnabled(true);
          Alert.alert('Success', 'Biometric login enabled successfully.');
        } else {
          Alert.alert('Error', 'Failed to enable biometric login. Please try again.');
        }
      } else {
        // Disable biometrics
        const success = await disableBiometricLogin();
        
        if (success) {
          setBiometricsEnabled(false);
          Alert.alert('Success', 'Biometric login disabled successfully.');
        } else {
          Alert.alert('Error', 'Failed to disable biometric login. Please try again.');
        }
      }
    } catch (error) {
      console.log('Biometrics toggle error:', error);
      Alert.alert('Error', 'Failed to toggle biometric login. Please try again.');
    }
  };
  
  // Handle notifications toggle
  const handleNotificationsToggle = async (value) => {
    try {
      if (value) {
        // Request notification permissions
        await requestPermissions();
        setNotificationsEnabled(true);
      } else {
        // Open notification settings
        openNotificationSettings();
      }
    } catch (error) {
      console.log('Notifications toggle error:', error);
      Alert.alert('Error', 'Failed to toggle notifications. Please try again.');
    }
  };
  
  // Handle auto-play videos toggle
  const handleAutoPlayToggle = async (value) => {
    try {
      setAutoPlayVideos(value);
      await AsyncStorage.setItem('autoPlayVideos', value.toString());
    } catch (error) {
      console.log('Auto-play toggle error:', error);
      Alert.alert('Error', 'Failed to save setting. Please try again.');
    }
  };
  
  // Handle offline downloads toggle
  const handleOfflineDownloadsToggle = async (value) => {
    try {
      setOfflineDownloadsEnabled(value);
      await AsyncStorage.setItem('offlineDownloadsEnabled', value.toString());
    } catch (error) {
      console.log('Offline downloads toggle error:', error);
      Alert.alert('Error', 'Failed to save setting. Please try again.');
    }
  };
  
  // Handle theme change
  const handleThemeChange = async (value) => {
    try {
      setSelectedTheme(value);
      setTheme(value);
      setShowThemeDialog(false);
    } catch (error) {
      console.log('Theme change error:', error);
      Alert.alert('Error', 'Failed to change theme. Please try again.');
    }
  };
  
  // Handle font size change
  const handleFontSizeChange = async (value) => {
    try {
      setFontSizeMultiplier(value);
      await AsyncStorage.setItem('fontSizeMultiplier', value.toString());
      setShowFontSizeDialog(false);
    } catch (error) {
      console.log('Font size change error:', error);
      Alert.alert('Error', 'Failed to change font size. Please try again.');
    }
  };
  
  // Handle clear data
  const handleClearData = async () => {
    try {
      // Clear offline data
      await AsyncStorage.removeItem('offlineData');
      
      // Clear settings
      await AsyncStorage.removeItem('autoPlayVideos');
      await AsyncStorage.removeItem('fontSizeMultiplier');
      await AsyncStorage.removeItem('offlineDownloadsEnabled');
      
      // Reset state
      setAutoPlayVideos(true);
      setFontSizeMultiplier(1);
      setOfflineDownloadsEnabled(true);
      
      setShowClearDataDialog(false);
      
      Alert.alert('Success', 'All app data has been cleared successfully.');
    } catch (error) {
      console.log('Clear data error:', error);
      Alert.alert('Error', 'Failed to clear data. Please try again.');
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        {/* Account Settings */}
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          
          <List.Item
            title="Edit Profile"
            description="Change your name, email, and profile picture"
            left={props => <List.Icon {...props} icon="account-edit" />}
            onPress={() => navigation.navigate('EditProfile')}
          />
          
          <Divider />
          
          <List.Item
            title="Change Password"
            description="Update your password"
            left={props => <List.Icon {...props} icon="lock-reset" />}
            onPress={() => navigation.navigate('ChangePassword')}
          />
          
          <Divider />
          
          <List.Item
            title="Biometric Login"
            description={biometricsAvailable ? "Use fingerprint or face ID to log in" : "Not available on this device"}
            left={props => <List.Icon {...props} icon="fingerprint" />}
            right={() => (
              <Switch
                value={biometricsEnabled}
                onValueChange={handleBiometricsToggle}
                disabled={!biometricsAvailable}
              />
            )}
          />
        </List.Section>
        
        {/* Appearance Settings */}
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          
          <List.Item
            title="Theme"
            description={
              selectedTheme === 'light' ? 'Light' : 
              selectedTheme === 'dark' ? 'Dark' : 'System Default'
            }
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            onPress={() => setShowThemeDialog(true)}
          />
          
          <Divider />
          
          <List.Item
            title="Font Size"
            description={
              fontSizeMultiplier === 0.8 ? 'Small' : 
              fontSizeMultiplier === 1 ? 'Medium' : 
              fontSizeMultiplier === 1.2 ? 'Large' : 'Extra Large'
            }
            left={props => <List.Icon {...props} icon="format-size" />}
            onPress={() => setShowFontSizeDialog(true)}
          />
        </List.Section>
        
        {/* Notification Settings */}
        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          
          <List.Item
            title="Push Notifications"
            description="Receive notifications for course updates and lab notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
              />
            )}
          />
        </List.Section>
        
        {/* Content Settings */}
        <List.Section>
          <List.Subheader>Content</List.Subheader>
          
          <List.Item
            title="Auto-Play Videos"
            description="Automatically play videos in lessons"
            left={props => <List.Icon {...props} icon="play-circle" />}
            right={() => (
              <Switch
                value={autoPlayVideos}
                onValueChange={handleAutoPlayToggle}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Offline Downloads"
            description="Automatically download content for offline use when on Wi-Fi"
            left={props => <List.Icon {...props} icon="download" />}
            right={() => (
              <Switch
                value={offlineDownloadsEnabled}
                onValueChange={handleOfflineDownloadsToggle}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Manage Downloads"
            description="View and delete downloaded content"
            left={props => <List.Icon {...props} icon="folder" />}
            onPress={() => navigation.navigate('ManageDownloads')}
          />
        </List.Section>
        
        {/* Data & Privacy */}
        <List.Section>
          <List.Subheader>Data & Privacy</List.Subheader>
          
          <List.Item
            title="Clear App Data"
            description="Clear all cached data and settings"
            left={props => <List.Icon {...props} icon="delete" />}
            onPress={() => setShowClearDataDialog(true)}
          />
          
          <Divider />
          
          <List.Item
            title="Privacy Policy"
            description="Read our privacy policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          
          <Divider />
          
          <List.Item
            title="Terms of Service"
            description="Read our terms of service"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => navigation.navigate('TermsOfService')}
          />
        </List.Section>
        
        {/* About */}
        <List.Section>
          <List.Subheader>About</List.Subheader>
          
          <List.Item
            title="App Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          
          <Divider />
          
          <List.Item
            title="Help & Support"
            description="Get help with the app"
            left={props => <List.Icon {...props} icon="help-circle" />}
            onPress={() => navigation.navigate('Support')}
          />
          
          <Divider />
          
          <List.Item
            title="Rate the App"
            description="Rate us on the app store"
            left={props => <List.Icon {...props} icon="star" />}
            onPress={() => {
              const url = Platform.OS === 'ios'
                ? 'https://apps.apple.com/app/id123456789'
                : 'https://play.google.com/store/apps/details?id=com.ethicalhackinglms';
              
              Linking.canOpenURL(url).then(supported => {
                if (supported) {
                  Linking.openURL(url);
                } else {
                  Alert.alert('Error', 'Could not open app store.');
                }
              });
            }}
          />
        </List.Section>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Theme Dialog */}
      <Portal>
        <Dialog visible={showThemeDialog} onDismiss={() => setShowThemeDialog(false)}>
          <Dialog.Title>Choose Theme</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => setSelectedTheme(value)} value={selectedTheme}>
              <RadioButton.Item label="Light" value="light" />
              <RadioButton.Item label="Dark" value="dark" />
              <RadioButton.Item label="System Default" value="auto" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowThemeDialog(false)}>Cancel</Button>
            <Button onPress={() => handleThemeChange(selectedTheme)}>Apply</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Font Size Dialog */}
      <Portal>
        <Dialog visible={showFontSizeDialog} onDismiss={() => setShowFontSizeDialog(false)}>
          <Dialog.Title>Choose Font Size</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => setFontSizeMultiplier(parseFloat(value))} value={fontSizeMultiplier.toString()}>
              <RadioButton.Item label="Small" value="0.8" />
              <RadioButton.Item label="Medium (Default)" value="1" />
              <RadioButton.Item label="Large" value="1.2" />
              <RadioButton.Item label="Extra Large" value="1.4" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowFontSizeDialog(false)}>Cancel</Button>
            <Button onPress={() => handleFontSizeChange(fontSizeMultiplier)}>Apply</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Clear Data Dialog */}
      <Portal>
        <Dialog visible={showClearDataDialog} onDismiss={() => setShowClearDataDialog(false)}>
          <Dialog.Title>Clear App Data</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              This will clear all cached data, downloaded content, and reset all settings to default.
              This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDataDialog(false)}>Cancel</Button>
            <Button onPress={handleClearData} color="#f44336">Clear Data</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  bottomPadding: {
    height: 32,
  },
});

export default SettingsScreen;
