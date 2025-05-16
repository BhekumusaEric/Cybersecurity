import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
  Divider,
  Badge,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import { useNotification } from '../../context/NotificationContext';

const CustomDrawerContent = (props) => {
  const { user, logout } = useAuth();
  const { theme, themeMode, setTheme } = useTheme();
  const { isOnline } = useOffline();
  const { unreadCount } = useNotification();
  
  const [darkTheme, setDarkTheme] = React.useState(themeMode === 'dark');
  
  // Toggle dark theme
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    setTheme(darkTheme ? 'light' : 'dark');
  };
  
  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.log('Logout error:', error);
            Alert.alert('Error', 'Failed to log out. Please try again.');
          }
        }}
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <DrawerContentScrollView {...props}>
        {/* User Info */}
        <View style={styles.userInfoSection}>
          <TouchableOpacity
            style={styles.userInfoHeader}
            onPress={() => props.navigation.navigate('Profile')}
          >
            <Avatar.Image
              source={user?.avatar ? { uri: user.avatar } : require('../../assets/default-avatar.png')}
              size={50}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Title style={styles.title}>{user?.name || 'User'}</Title>
              <Caption style={styles.caption}>{user?.email || 'user@example.com'}</Caption>
            </View>
          </TouchableOpacity>
          
          {!isOnline && (
            <View style={styles.offlineContainer}>
              <Icon name="wifi-off" size={16} color="#fff" />
              <Text style={styles.offlineText}>Offline Mode</Text>
            </View>
          )}
          
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Paragraph style={styles.statValue}>2</Paragraph>
              <Caption style={styles.statLabel}>Courses</Caption>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statValue}>8</Paragraph>
              <Caption style={styles.statLabel}>Labs</Caption>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statValue}>5</Paragraph>
              <Caption style={styles.statLabel}>Quizzes</Caption>
            </View>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Drawer Items */}
        <DrawerItemList {...props} />
        
        <Divider style={styles.divider} />
        
        {/* Additional Items */}
        <DrawerItem
          label="Notifications"
          icon={({ color, size }) => (
            <View style={styles.iconContainer}>
              <Icon name="bell" color={color} size={size} />
              {unreadCount > 0 && (
                <Badge style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</Badge>
              )}
            </View>
          )}
          onPress={() => props.navigation.navigate('Notifications')}
        />
        
        <DrawerItem
          label="Downloads"
          icon={({ color, size }) => (
            <Icon name="download" color={color} size={size} />
          )}
          onPress={() => props.navigation.navigate('ManageDownloads')}
        />
        
        <DrawerItem
          label="Help & Support"
          icon={({ color, size }) => (
            <Icon name="help-circle" color={color} size={size} />
          )}
          onPress={() => props.navigation.navigate('Support')}
        />
        
        <DrawerItem
          label="About"
          icon={({ color, size }) => (
            <Icon name="information" color={color} size={size} />
          )}
          onPress={() => props.navigation.navigate('About')}
        />
      </DrawerContentScrollView>
      
      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Divider style={styles.divider} />
        
        {/* Dark Mode Toggle */}
        <TouchableRipple onPress={toggleTheme}>
          <View style={styles.preference}>
            <View style={styles.preferenceText}>
              <Icon name="theme-light-dark" color={theme.colors.text} size={22} />
              <Text style={styles.preferenceLabel}>Dark Theme</Text>
            </View>
            <Switch value={darkTheme} onValueChange={toggleTheme} />
          </View>
        </TouchableRipple>
        
        <Divider style={styles.divider} />
        
        {/* Logout Button */}
        <TouchableRipple onPress={handleLogout}>
          <View style={styles.preference}>
            <View style={styles.preferenceText}>
              <Icon name="logout" color={theme.colors.text} size={22} />
              <Text style={styles.preferenceLabel}>Logout</Text>
            </View>
          </View>
        </TouchableRipple>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#E0E0E0',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  caption: {
    fontSize: 12,
    lineHeight: 14,
  },
  offlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  offlineText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  divider: {
    marginVertical: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    fontSize: 10,
    height: 16,
    width: 16,
    borderRadius: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  bottomSection: {
    paddingBottom: 16,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  preferenceText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceLabel: {
    marginLeft: 16,
    fontSize: 14,
  },
});

export default CustomDrawerContent;
