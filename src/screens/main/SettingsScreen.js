/**
 * Settings Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsScreen = ({ navigation }) => {
  const { colors, themeMode, changeThemeMode } = useTheme();
  const { biometricsAvailable, enableBiometricLogin, disableBiometricLogin } = useAuth();
  const { autoDownload, autoSync, toggleAutoDownload, toggleAutoSync } = useOffline();
  
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleThemeChange = (mode) => {
    changeThemeMode(mode);
  };
  
  const handleBiometricToggle = async (value) => {
    if (value) {
      // In a real app, you would prompt for credentials here
      Alert.alert(
        'Enable Biometric Login',
        'This will allow you to log in using your fingerprint or face ID. Do you want to continue?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Enable',
            onPress: async () => {
              // Simulate enabling biometric login
              await enableBiometricLogin('user@example.com', 'password');
              setBiometricEnabled(true);
            },
          },
        ]
      );
    } else {
      await disableBiometricLogin();
      setBiometricEnabled(false);
    }
  };
  
  const handleNotificationsToggle = (value) => {
    setNotificationsEnabled(value);
    // In a real app, you would update the notification settings on the server
  };
  
  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Do you want to continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => {
            // In a real app, you would clear the cache here
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };
  
  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to default. Do you want to continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            // In a real app, you would reset all settings here
            changeThemeMode('system');
            setBiometricEnabled(false);
            setNotificationsEnabled(true);
            toggleAutoDownload(true);
            toggleAutoSync(true);
            Alert.alert('Success', 'Settings reset to default');
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginHorizontal: 16,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      marginHorizontal: 16,
      marginBottom: 8,
      overflow: 'hidden',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itemLast: {
      borderBottomWidth: 0,
    },
    itemIcon: {
      marginRight: 16,
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 4,
    },
    itemDescription: {
      fontSize: 14,
      color: colors.text + '99',
    },
    themeOptions: {
      flexDirection: 'row',
      marginTop: 8,
    },
    themeOption: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
    },
    themeOptionText: {
      fontSize: 14,
    },
    dangerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    dangerItemTitle: {
      fontSize: 16,
      color: colors.error,
      marginLeft: 16,
    },
    version: {
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 32,
    },
    versionText: {
      fontSize: 14,
      color: colors.text + '99',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <View style={styles.item}>
            <Icon
              name="theme-light-dark"
              size={24}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Theme</Text>
              <Text style={styles.itemDescription}>
                {themeMode === 'light'
                  ? 'Light'
                  : themeMode === 'dark'
                  ? 'Dark'
                  : themeMode === 'system'
                  ? 'System Default'
                  : 'High Contrast'}
              </Text>
              <View style={styles.themeOptions}>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor:
                        themeMode === 'light' ? colors.primary + '20' : 'transparent',
                      borderWidth: 1,
                      borderColor:
                        themeMode === 'light' ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleThemeChange('light')}
                >
                  <Text
                    style={[
                      styles.themeOptionText,
                      {
                        color: themeMode === 'light' ? colors.primary : colors.text,
                      },
                    ]}
                  >
                    Light
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor:
                        themeMode === 'dark' ? colors.primary + '20' : 'transparent',
                      borderWidth: 1,
                      borderColor:
                        themeMode === 'dark' ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleThemeChange('dark')}
                >
                  <Text
                    style={[
                      styles.themeOptionText,
                      {
                        color: themeMode === 'dark' ? colors.primary : colors.text,
                      },
                    ]}
                  >
                    Dark
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor:
                        themeMode === 'system' ? colors.primary + '20' : 'transparent',
                      borderWidth: 1,
                      borderColor:
                        themeMode === 'system' ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleThemeChange('system')}
                >
                  <Text
                    style={[
                      styles.themeOptionText,
                      {
                        color: themeMode === 'system' ? colors.primary : colors.text,
                      },
                    ]}
                  >
                    System
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          {biometricsAvailable && (
            <View style={styles.item}>
              <Icon
                name="fingerprint"
                size={24}
                color={colors.primary}
                style={styles.itemIcon}
              />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Biometric Login</Text>
                <Text style={styles.itemDescription}>
                  Use your fingerprint or face ID to log in
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={biometricEnabled ? colors.primary : colors.card}
              />
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.item, styles.itemLast]}
            onPress={() => navigation.navigate('Security')}
          >
            <Icon
              name="shield-check"
              size={24}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Security Settings</Text>
              <Text style={styles.itemDescription}>
                Manage security settings and privacy
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.text + '50'} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.item}>
            <Icon
              name="bell"
              size={24}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Push Notifications</Text>
              <Text style={styles.itemDescription}>
                Receive notifications about course updates and lab sessions
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={notificationsEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.item, styles.itemLast]}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon
              name="bell-outline"
              size={24}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Notification Settings</Text>
              <Text style={styles.itemDescription}>
                Manage notification preferences
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.text + '50'} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offline Content</Text>
        <View style={styles.card}>
          <View style={styles.item}>
            <Icon
              name="download"
              size={24}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Auto Download</Text>
              <Text style={styles.itemDescription}>
                Automatically download content for offline use
              </Text>
            </View>
            <Switch
              value={autoDownload}
              onValueChange={toggleAutoDownload}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={autoDownload ? colors.primary : colors.card}
            />
          </View>
          
          <View style={styles.item}>
            <Icon
              name="sync"
              size={24}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Auto Sync</Text>
              <Text style={styles.itemDescription}>
                Automatically sync progress when online
              </Text>
            </View>
            <Switch
              value={autoSync}
              onValueChange={toggleAutoSync}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={autoSync ? colors.primary : colors.card}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.item, styles.itemLast]}
            onPress={() => navigation.navigate('Offline Content')}
          >
            <Icon
              name="folder-download"
              size={24}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Manage Offline Content</Text>
              <Text style={styles.itemDescription}>
                View and manage downloaded content
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.text + '50'} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              // In a real app, this would open the privacy policy
              Alert.alert('Privacy Policy', 'Opening privacy policy...');
            }}
          >
            <Icon
              name="shield-account"
              size={24}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Privacy Policy</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.text + '50'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.item, styles.itemLast]}
            onPress={() => {
              // In a real app, this would open the terms of service
              Alert.alert('Terms of Service', 'Opening terms of service...');
            }}
          >
            <Icon
              name="file-document"
              size={24}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Terms of Service</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.text + '50'} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.item} onPress={handleClearCache}>
            <Icon
              name="cached"
              size={24}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Clear Cache</Text>
              <Text style={styles.itemDescription}>
                Clear cached data to free up space
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.item, styles.itemLast]}
            onPress={handleResetSettings}
          >
            <Icon
              name="refresh"
              size={24}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Reset Settings</Text>
              <Text style={styles.itemDescription}>
                Reset all settings to default
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.version}>
        <Text style={styles.versionText}>Ethical Hacking LMS v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
