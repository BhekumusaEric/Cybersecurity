/**
 * Security Screen
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SecurityScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, biometricsAvailable, enableBiometricLogin, disableBiometricLogin } = useAuth();
  
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30min');
  const [loading, setLoading] = useState(false);
  const [securityEvents, setSecurityEvents] = useState([
    {
      id: '1',
      type: 'login',
      device: 'iPhone 13',
      location: 'New York, USA',
      ip: '192.168.1.1',
      date: '2023-09-15T10:30:00Z',
    },
    {
      id: '2',
      type: 'password_change',
      device: 'MacBook Pro',
      location: 'New York, USA',
      ip: '192.168.1.2',
      date: '2023-09-10T14:45:00Z',
    },
    {
      id: '3',
      type: 'login',
      device: 'Samsung Galaxy S21',
      location: 'Los Angeles, USA',
      ip: '192.168.1.3',
      date: '2023-09-05T09:15:00Z',
    },
  ]);
  
  useEffect(() => {
    // Simulate loading user security settings
    setLoading(true);
    setTimeout(() => {
      // In a real app, you would fetch these settings from the server
      setBiometricEnabled(false);
      setPinEnabled(true);
      setTwoFactorEnabled(false);
      setLoading(false);
    }, 1000);
  }, []);
  
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
              setLoading(true);
              try {
                // Simulate enabling biometric login
                await enableBiometricLogin('user@example.com', 'password');
                setBiometricEnabled(true);
              } catch (error) {
                Alert.alert('Error', 'Failed to enable biometric login');
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } else {
      setLoading(true);
      try {
        await disableBiometricLogin();
        setBiometricEnabled(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to disable biometric login');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handlePinToggle = (value) => {
    if (value) {
      // In a real app, you would navigate to a PIN setup screen
      Alert.alert(
        'Set PIN',
        'You will be prompted to set a PIN for app access',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: () => {
              // Simulate setting up PIN
              setTimeout(() => {
                setPinEnabled(true);
                Alert.alert('Success', 'PIN has been set successfully');
              }, 500);
            },
          },
        ]
      );
    } else {
      // In a real app, you would prompt for the current PIN
      Alert.alert(
        'Disable PIN',
        'Are you sure you want to disable PIN protection?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Disable',
            onPress: () => {
              setPinEnabled(false);
            },
          },
        ]
      );
    }
  };
  
  const handleTwoFactorToggle = (value) => {
    if (value) {
      // In a real app, you would navigate to a 2FA setup screen
      Alert.alert(
        'Enable Two-Factor Authentication',
        'You will be guided through the process of setting up two-factor authentication',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: () => {
              // Simulate setting up 2FA
              setTimeout(() => {
                setTwoFactorEnabled(true);
                Alert.alert('Success', 'Two-factor authentication has been enabled');
              }, 500);
            },
          },
        ]
      );
    } else {
      // In a real app, you would prompt for confirmation
      Alert.alert(
        'Disable Two-Factor Authentication',
        'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Disable',
            onPress: () => {
              setTwoFactorEnabled(false);
            },
          },
        ]
      );
    }
  };
  
  const handleSessionTimeoutChange = (timeout) => {
    setSessionTimeout(timeout);
    // In a real app, you would update this setting on the server
  };
  
  const handleChangePassword = () => {
    // In a real app, you would navigate to a change password screen
    Alert.alert('Change Password', 'Navigating to change password screen...');
  };
  
  const handleLogoutAllDevices = () => {
    Alert.alert(
      'Logout from All Devices',
      'Are you sure you want to log out from all devices? You will need to log in again on all devices.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout All',
          onPress: () => {
            // In a real app, you would call an API to invalidate all sessions
            Alert.alert('Success', 'You have been logged out from all devices');
          },
        },
      ]
    );
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getEventIcon = (type) => {
    switch (type) {
      case 'login':
        return 'login';
      case 'logout':
        return 'logout';
      case 'password_change':
        return 'form-textbox-password';
      case 'settings_change':
        return 'cog';
      default:
        return 'shield-account';
    }
  };
  
  const getEventText = (type) => {
    switch (type) {
      case 'login':
        return 'Login';
      case 'logout':
        return 'Logout';
      case 'password_change':
        return 'Password Changed';
      case 'settings_change':
        return 'Settings Changed';
      default:
        return 'Security Event';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.text + '99',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      marginBottom: 8,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
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
    timeoutOptions: {
      flexDirection: 'row',
      marginTop: 8,
    },
    timeoutOption: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
    },
    timeoutOptionText: {
      fontSize: 14,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.primary,
      marginBottom: 16,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    dangerButton: {
      backgroundColor: colors.error + '20',
    },
    dangerButtonText: {
      color: colors.error,
    },
    eventItem: {
      flexDirection: 'row',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    eventIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    eventContent: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    eventDetails: {
      fontSize: 14,
      color: colors.text + '99',
      marginBottom: 4,
    },
    eventDate: {
      fontSize: 12,
      color: colors.text + '80',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16, color: colors.text }}>Loading security settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Security Settings</Text>
        <Text style={styles.headerSubtitle}>
          Manage your account security and privacy settings
        </Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication</Text>
          
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
            
            <View style={styles.item}>
              <Icon
                name="pin"
                size={24}
                color={colors.primary}
                style={styles.itemIcon}
              />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>PIN Protection</Text>
                <Text style={styles.itemDescription}>
                  Require PIN to access the app
                </Text>
              </View>
              <Switch
                value={pinEnabled}
                onValueChange={handlePinToggle}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={pinEnabled ? colors.primary : colors.card}
              />
            </View>
            
            <View style={[styles.item, styles.itemLast]}>
              <Icon
                name="two-factor-authentication"
                size={24}
                color={colors.primary}
                style={styles.itemIcon}
              />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Two-Factor Authentication</Text>
                <Text style={styles.itemDescription}>
                  Add an extra layer of security to your account
                </Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={handleTwoFactorToggle}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={twoFactorEnabled ? colors.primary : colors.card}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session</Text>
          
          <View style={styles.card}>
            <View style={[styles.item, styles.itemLast]}>
              <Icon
                name="timer-outline"
                size={24}
                color={colors.primary}
                style={styles.itemIcon}
              />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Session Timeout</Text>
                <Text style={styles.itemDescription}>
                  Automatically log out after a period of inactivity
                </Text>
                
                <View style={styles.timeoutOptions}>
                  <TouchableOpacity
                    style={[
                      styles.timeoutOption,
                      {
                        backgroundColor:
                          sessionTimeout === '5min' ? colors.primary + '20' : 'transparent',
                        borderWidth: 1,
                        borderColor:
                          sessionTimeout === '5min' ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => handleSessionTimeoutChange('5min')}
                  >
                    <Text
                      style={[
                        styles.timeoutOptionText,
                        {
                          color: sessionTimeout === '5min' ? colors.primary : colors.text,
                        },
                      ]}
                    >
                      5 min
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.timeoutOption,
                      {
                        backgroundColor:
                          sessionTimeout === '15min' ? colors.primary + '20' : 'transparent',
                        borderWidth: 1,
                        borderColor:
                          sessionTimeout === '15min' ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => handleSessionTimeoutChange('15min')}
                  >
                    <Text
                      style={[
                        styles.timeoutOptionText,
                        {
                          color: sessionTimeout === '15min' ? colors.primary : colors.text,
                        },
                      ]}
                    >
                      15 min
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.timeoutOption,
                      {
                        backgroundColor:
                          sessionTimeout === '30min' ? colors.primary + '20' : 'transparent',
                        borderWidth: 1,
                        borderColor:
                          sessionTimeout === '30min' ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => handleSessionTimeoutChange('30min')}
                  >
                    <Text
                      style={[
                        styles.timeoutOptionText,
                        {
                          color: sessionTimeout === '30min' ? colors.primary : colors.text,
                        },
                      ]}
                    >
                      30 min
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.timeoutOption,
                      {
                        backgroundColor:
                          sessionTimeout === '1hour' ? colors.primary + '20' : 'transparent',
                        borderWidth: 1,
                        borderColor:
                          sessionTimeout === '1hour' ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => handleSessionTimeoutChange('1hour')}
                  >
                    <Text
                      style={[
                        styles.timeoutOptionText,
                        {
                          color: sessionTimeout === '1hour' ? colors.primary : colors.text,
                        },
                      ]}
                    >
                      1 hour
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleChangePassword}
          >
            <Icon name="lock-reset" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleLogoutAllDevices}
          >
            <Icon name="logout-variant" size={20} color={colors.error} />
            <Text style={styles.dangerButtonText}>Logout from All Devices</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Security Events</Text>
          
          <View style={styles.card}>
            {securityEvents.map((event, index) => (
              <View
                key={event.id}
                style={[
                  styles.eventItem,
                  index === securityEvents.length - 1 && styles.itemLast,
                ]}
              >
                <View style={styles.eventIcon}>
                  <Icon
                    name={getEventIcon(event.type)}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{getEventText(event.type)}</Text>
                  <Text style={styles.eventDetails}>
                    {event.device} • {event.location}
                  </Text>
                  <Text style={styles.eventDetails}>IP: {event.ip}</Text>
                  <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SecurityScreen;
