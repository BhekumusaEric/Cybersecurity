import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert, Linking } from 'react-native';
import axios from 'axios';

import { API_URL } from '../config/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pushToken, setPushToken] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('not-determined'); // 'granted', 'denied', 'not-determined'
  
  // Load notifications from storage
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const savedNotifications = await AsyncStorage.getItem('notifications');
        if (savedNotifications) {
          const parsedNotifications = JSON.parse(savedNotifications);
          setNotifications(parsedNotifications);
          
          // Count unread notifications
          const unread = parsedNotifications.filter(n => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.log('Load notifications error:', error);
      }
    };
    
    loadNotifications();
  }, []);
  
  // Fetch notifications from server when user is logged in
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);
  
  // Fetch notifications from server
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notifications`);
      const serverNotifications = res.data;
      
      // Merge with local notifications
      const mergedNotifications = mergeNotifications(serverNotifications, notifications);
      
      // Save to state and storage
      setNotifications(mergedNotifications);
      await AsyncStorage.setItem('notifications', JSON.stringify(mergedNotifications));
      
      // Count unread notifications
      const unread = mergedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.log('Fetch notifications error:', error);
    }
  };
  
  // Merge server and local notifications
  const mergeNotifications = (serverNotifications, localNotifications) => {
    // Create a map of local notifications by ID
    const localNotificationsMap = localNotifications.reduce((map, notification) => {
      map[notification.id] = notification;
      return map;
    }, {});
    
    // Merge server notifications with local read status
    const mergedNotifications = serverNotifications.map(notification => {
      const localNotification = localNotificationsMap[notification.id];
      return {
        ...notification,
        read: localNotification ? localNotification.read : notification.read,
      };
    });
    
    return mergedNotifications;
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      // Update local state
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      setNotifications(updatedNotifications);
      
      // Update unread count
      const unread = updatedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      
      // Save to storage
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
      // Update on server
      await axios.put(`${API_URL}/api/notifications/${notificationId}/read`);
    } catch (error) {
      console.log('Mark notification as read error:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Update local state
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true,
      }));
      
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      
      // Save to storage
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
      // Update on server
      await axios.put(`${API_URL}/api/notifications/read-all`);
    } catch (error) {
      console.log('Mark all notifications as read error:', error);
    }
  };
  
  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      // Update local state
      const updatedNotifications = notifications.filter(
        notification => notification.id !== notificationId
      );
      
      setNotifications(updatedNotifications);
      
      // Update unread count
      const unread = updatedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      
      // Save to storage
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
      // Delete on server
      await axios.delete(`${API_URL}/api/notifications/${notificationId}`);
    } catch (error) {
      console.log('Delete notification error:', error);
    }
  };
  
  // Request push notification permissions
  const requestPermissions = async () => {
    try {
      // This would use actual push notification library in a real implementation
      // For now, we'll simulate the permission request
      
      Alert.alert(
        'Allow Notifications',
        'Would you like to receive push notifications for course updates and lab notifications?',
        [
          {
            text: 'No',
            onPress: () => setPermissionStatus('denied'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              setPermissionStatus('granted');
              // Simulate getting a token
              const simulatedToken = 'simulated-push-token-' + Math.random().toString(36).substring(7);
              setPushToken(simulatedToken);
              
              // In a real app, we would register this token with the server
              registerPushToken(simulatedToken);
            },
          },
        ]
      );
    } catch (error) {
      console.log('Request permissions error:', error);
    }
  };
  
  // Register push token with server
  const registerPushToken = async (token) => {
    try {
      if (user) {
        await axios.post(`${API_URL}/api/notifications/register-device`, {
          token,
          platform: Platform.OS,
        });
      }
    } catch (error) {
      console.log('Register push token error:', error);
    }
  };
  
  // Open notification settings
  const openNotificationSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        permissionStatus,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications,
        requestPermissions,
        openNotificationSettings,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
