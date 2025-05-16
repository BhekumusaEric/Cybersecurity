import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  ActivityIndicator,
  IconButton,
  Chip,
  Menu,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { format, formatDistanceToNow } from 'date-fns';

import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import { useNotification } from '../../context/NotificationContext';

const NotificationsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { isOnline } = useOffline();
  const { 
    notifications, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'unread', 'read'
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  
  // Load notifications
  const loadNotifications = async () => {
    try {
      setError(null);
      
      if (isOnline) {
        await fetchNotifications();
      }
      
      filterNotifications(selectedFilter);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Load data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadNotifications();
    }, [isOnline])
  );
  
  // Filter notifications
  const filterNotifications = (filter) => {
    let filtered = [...notifications];
    
    if (filter === 'unread') {
      filtered = filtered.filter(notification => !notification.read);
    } else if (filter === 'read') {
      filtered = filtered.filter(notification => notification.read);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredNotifications(filtered);
    setSelectedFilter(filter);
  };
  
  // Effect to update filtered notifications when notifications change
  useEffect(() => {
    filterNotifications(selectedFilter);
  }, [notifications]);
  
  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      Alert.alert('Success', 'All notifications marked as read.');
    } catch (err) {
      console.error('Error marking all as read:', err);
      Alert.alert('Error', 'Failed to mark all notifications as read. Please try again.');
    }
  };
  
  // Handle notification press
  const handleNotificationPress = async (notification) => {
    try {
      // Mark as read if not already read
      if (!notification.read) {
        await markAsRead(notification.id);
      }
      
      // Navigate based on notification type
      switch (notification.type) {
        case 'course':
          navigation.navigate('CourseDetail', { courseId: notification.data.courseId });
          break;
        case 'lesson':
          navigation.navigate('Lesson', { 
            lessonId: notification.data.lessonId,
            courseId: notification.data.courseId
          });
          break;
        case 'lab':
          navigation.navigate('LabDetail', { labId: notification.data.labId });
          break;
        case 'assessment':
          navigation.navigate('AssessmentDetail', { assessmentId: notification.data.assessmentId });
          break;
        case 'announcement':
          // Just mark as read, no navigation
          break;
        default:
          // Default behavior for unknown types
          break;
      }
    } catch (err) {
      console.error('Error handling notification:', err);
      Alert.alert('Error', 'Failed to process notification. Please try again.');
    }
  };
  
  // Handle delete notification
  const handleDeleteNotification = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: async () => {
            try {
              await deleteNotification(notificationId);
            } catch (err) {
              console.error('Error deleting notification:', err);
              Alert.alert('Error', 'Failed to delete notification. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Format notification date
  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5; // hours
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };
  
  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'course':
        return 'book-open-variant';
      case 'lesson':
        return 'book-open-page-variant';
      case 'lab':
        return 'console';
      case 'assessment':
        return 'clipboard-check';
      case 'announcement':
        return 'bullhorn';
      default:
        return 'bell';
    }
  };
  
  // Render notification item
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationIconContainer}>
        <Icon 
          name={getNotificationIcon(item.type)} 
          size={24} 
          color={!item.read ? theme.colors.primary : '#757575'} 
        />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text 
            style={[
              styles.notificationTitle,
              !item.read && styles.unreadNotificationTitle
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.notificationDate}>
            {formatNotificationDate(item.date)}
          </Text>
        </View>
        
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        
        <View style={styles.notificationFooter}>
          <Chip 
            style={styles.notificationTypeChip}
            textStyle={styles.notificationTypeText}
          >
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Chip>
          
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDeleteNotification(item.id)}
            style={styles.deleteButton}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Render separator
  const renderSeparator = () => <Divider style={styles.divider} />;
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="bell-off" size={64} color="#BDBDBD" />
      <Text style={styles.emptyStateTitle}>No Notifications</Text>
      <Text style={styles.emptyStateText}>
        {selectedFilter === 'all'
          ? 'You don\'t have any notifications yet.'
          : selectedFilter === 'unread'
            ? 'You don\'t have any unread notifications.'
            : 'You don\'t have any read notifications.'}
      </Text>
    </View>
  );
  
  // Render loading state
  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading notifications...</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Notifications" />
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action 
              icon="filter-variant" 
              onPress={() => setMenuVisible(true)} 
            />
          }
        >
          <Menu.Item 
            title="All Notifications" 
            onPress={() => {
              filterNotifications('all');
              setMenuVisible(false);
            }}
            leadingIcon="bell-outline"
          />
          <Menu.Item 
            title="Unread" 
            onPress={() => {
              filterNotifications('unread');
              setMenuVisible(false);
            }}
            leadingIcon="bell-ring-outline"
          />
          <Menu.Item 
            title="Read" 
            onPress={() => {
              filterNotifications('read');
              setMenuVisible(false);
            }}
            leadingIcon="bell-check-outline"
          />
          <Divider />
          <Menu.Item 
            title="Mark All as Read" 
            onPress={() => {
              handleMarkAllAsRead();
              setMenuVisible(false);
            }}
            leadingIcon="check-all"
          />
        </Menu>
      </Appbar.Header>
      
      <View style={styles.filterChipsContainer}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedFilter === 'all' && styles.activeFilterChip
          ]}
          onPress={() => filterNotifications('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedFilter === 'all' && styles.activeFilterChipText
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedFilter === 'unread' && styles.activeFilterChip
          ]}
          onPress={() => filterNotifications('unread')}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedFilter === 'unread' && styles.activeFilterChipText
            ]}
          >
            Unread
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedFilter === 'read' && styles.activeFilterChip
          ]}
          onPress={() => filterNotifications('read')}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedFilter === 'read' && styles.activeFilterChipText
            ]}
          >
            Read
          </Text>
        </TouchableOpacity>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={24} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />
      
      {filteredNotifications.length > 0 && (
        <View style={styles.markAllContainer}>
          <Button
            mode="text"
            onPress={handleMarkAllAsRead}
            disabled={!filteredNotifications.some(n => !n.read)}
          >
            Mark All as Read
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  activeFilterChip: {
    backgroundColor: '#1976d2',
  },
  filterChipText: {
    color: '#757575',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  listContent: {
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
  },
  unreadNotification: {
    backgroundColor: 'rgba(25, 118, 210, 0.05)',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  unreadNotificationTitle: {
    fontWeight: 'bold',
  },
  notificationDate: {
    fontSize: 12,
    color: '#757575',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTypeChip: {
    height: 24,
    backgroundColor: '#E0E0E0',
  },
  notificationTypeText: {
    fontSize: 10,
  },
  deleteButton: {
    margin: 0,
  },
  divider: {
    marginLeft: 72,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#757575',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#f44336',
    marginLeft: 8,
    flex: 1,
  },
  markAllContainer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
});

export default NotificationsScreen;
