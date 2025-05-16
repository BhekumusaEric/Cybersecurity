/**
 * Notifications Screen
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock data
const notificationsData = [
  {
    id: '1',
    title: 'New Course Available',
    message: 'A new course "Advanced Web Application Security" is now available.',
    type: 'course',
    read: false,
    date: '2023-09-15T10:30:00Z',
    data: {
      courseId: '5',
    },
  },
  {
    id: '2',
    title: 'Lab Session Reminder',
    message: 'Your scheduled lab session "Network Scanning Lab" starts in 1 hour.',
    type: 'lab',
    read: false,
    date: '2023-09-14T15:00:00Z',
    data: {
      labId: '1',
    },
  },
  {
    id: '3',
    title: 'Course Progress',
    message: 'You\'ve completed 75% of "Introduction to Ethical Hacking". Keep it up!',
    type: 'progress',
    read: true,
    date: '2023-09-12T09:45:00Z',
    data: {
      courseId: '1',
    },
  },
  {
    id: '4',
    title: 'Certificate Earned',
    message: 'Congratulations! You\'ve earned a certificate for completing "Network Security Fundamentals".',
    type: 'certificate',
    read: true,
    date: '2023-09-10T14:20:00Z',
    data: {
      certificateId: '2',
    },
  },
  {
    id: '5',
    title: 'New Lab Available',
    message: 'A new lab "Wireless Network Security" is now available.',
    type: 'lab',
    read: true,
    date: '2023-09-08T11:15:00Z',
    data: {
      labId: '5',
    },
  },
  {
    id: '6',
    title: 'Course Update',
    message: 'The course "Web Application Security" has been updated with new content.',
    type: 'course',
    read: true,
    date: '2023-09-05T16:30:00Z',
    data: {
      courseId: '3',
    },
  },
  {
    id: '7',
    title: 'Quiz Result',
    message: 'You scored 85% on the "SQL Injection" quiz. Great job!',
    type: 'quiz',
    read: true,
    date: '2023-09-03T13:10:00Z',
    data: {
      quizId: '3',
    },
  },
];

const NotificationsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  
  useEffect(() => {
    // Simulate API call to fetch notifications
    const fetchNotifications = async () => {
      try {
        // In a real app, you would fetch notifications from an API
        // For now, we'll use the mock data
        setTimeout(() => {
          setNotifications(notificationsData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);
  
  const handleMarkAsRead = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };
  
  const handleDeleteNotification = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setNotifications((prevNotifications) =>
              prevNotifications.filter(
                (notification) => notification.id !== notificationId
              )
            );
          },
        },
      ]
    );
  };
  
  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          onPress: () => {
            setNotifications([]);
          },
        },
      ]
    );
  };
  
  const handleNotificationPress = (notification) => {
    // Mark as read
    handleMarkAsRead(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'course':
        navigation.navigate('CourseDetail', { courseId: notification.data.courseId });
        break;
      case 'lab':
        navigation.navigate('LabDetail', { labId: notification.data.labId });
        break;
      case 'certificate':
        navigation.navigate('Certificates');
        break;
      case 'quiz':
        // Navigate to quiz result
        Alert.alert('Quiz Result', 'Navigating to quiz result...');
        break;
      case 'progress':
        navigation.navigate('CourseDetail', { courseId: notification.data.courseId });
        break;
      default:
        // Default action
        break;
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'course':
        return 'book-open-variant';
      case 'lab':
        return 'flask';
      case 'certificate':
        return 'certificate';
      case 'quiz':
        return 'clipboard-text';
      case 'progress':
        return 'chart-line';
      default:
        return 'bell';
    }
  };
  
  const getNotificationColor = (type) => {
    switch (type) {
      case 'course':
        return colors.primary;
      case 'lab':
        return colors.info;
      case 'certificate':
        return colors.success;
      case 'quiz':
        return colors.warning;
      case 'progress':
        return colors.accent;
      default:
        return colors.primary;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      // Yesterday
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      // Within a week
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${days[date.getDay()]} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      // More than a week ago
      return date.toLocaleDateString();
    }
  };
  
  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });
  
  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length;

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
      marginBottom: 16,
    },
    filterContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
    },
    filterButtonText: {
      fontWeight: '500',
    },
    actionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButtonText: {
      fontSize: 14,
      marginLeft: 4,
    },
    notificationItem: {
      backgroundColor: colors.card,
      borderLeftWidth: 4,
      marginBottom: 1,
      padding: 16,
    },
    notificationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    notificationIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 14,
      color: colors.text + '99',
      marginBottom: 8,
    },
    notificationDate: {
      fontSize: 12,
      color: colors.text + '80',
    },
    notificationActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
    },
    notificationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginLeft: 8,
    },
    notificationButtonText: {
      fontSize: 12,
      marginLeft: 4,
    },
    unreadIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
      position: 'absolute',
      top: 16,
      right: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 16,
      color: colors.text + '99',
      textAlign: 'center',
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
        <Text style={{ marginTop: 16, color: colors.text }}>Loading notifications...</Text>
      </View>
    );
  }

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: item.read ? colors.card : colors.card + '80',
          borderLeftColor: getNotificationColor(item.type),
        },
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <View
          style={[
            styles.notificationIcon,
            { backgroundColor: getNotificationColor(item.type) + '20' },
          ]}
        >
          <Icon
            name={getNotificationIcon(item.type)}
            size={20}
            color={getNotificationColor(item.type)}
          />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationDate}>{formatDate(item.date)}</Text>
        </View>
        {!item.read && <View style={styles.unreadIndicator} />}
      </View>
      <View style={styles.notificationActions}>
        {!item.read && (
          <TouchableOpacity
            style={[
              styles.notificationButton,
              { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => handleMarkAsRead(item.id)}
          >
            <Icon name="check" size={16} color={colors.primary} />
            <Text
              style={[styles.notificationButtonText, { color: colors.primary }]}
            >
              Mark as Read
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.notificationButton,
            { backgroundColor: colors.error + '20' },
          ]}
          onPress={() => handleDeleteNotification(item.id)}
        >
          <Icon name="delete" size={16} color={colors.error} />
          <Text style={[styles.notificationButtonText, { color: colors.error }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="bell-off"
        size={64}
        color={colors.text + '30'}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>
        {filter === 'all'
          ? 'No notifications yet'
          : filter === 'unread'
          ? 'No unread notifications'
          : 'No read notifications'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
        </Text>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: filter === 'all' ? colors.primary + '20' : 'transparent',
                borderColor: filter === 'all' ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                { color: filter === 'all' ? colors.primary : colors.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: filter === 'unread' ? colors.primary + '20' : 'transparent',
                borderColor: filter === 'unread' ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFilter('unread')}
          >
            <Text
              style={[
                styles.filterButtonText,
                { color: filter === 'unread' ? colors.primary : colors.text },
              ]}
            >
              Unread
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: filter === 'read' ? colors.primary + '20' : 'transparent',
                borderColor: filter === 'read' ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFilter('read')}
          >
            <Text
              style={[
                styles.filterButtonText,
                { color: filter === 'read' ? colors.primary : colors.text },
              ]}
            >
              Read
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionContainer}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleMarkAllAsRead}
            >
              <Icon name="check-all" size={20} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                Mark All as Read
              </Text>
            </TouchableOpacity>
          )}
          
          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleClearAll}
            >
              <Icon name="delete-sweep" size={20} color={colors.error} />
              <Text style={[styles.actionButtonText, { color: colors.error }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};

export default NotificationsScreen;
