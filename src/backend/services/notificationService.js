import { Notification } from '../models/index.js';
import { 
  sendUserNotification, 
  sendRoleNotification, 
  sendCourseNotification, 
  sendBroadcastNotification,
  isUserOnline
} from './socketService.js';
import logger from '../utils/logger.js';

// Create a notification
const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    logger.error('Error creating notification:', error);
    throw error;
  }
};

// Get notifications for a user
const getUserNotifications = async (userId, options = {}) => {
  try {
    const { limit = 20, offset = 0, includeRead = false } = options;
    
    const whereClause = {
      userId,
      ...(includeRead ? {} : { isRead: false })
    };
    
    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    return notifications;
  } catch (error) {
    logger.error(`Error getting notifications for user ${userId}:`, error);
    throw error;
  }
};

// Mark notification as read
const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        userId
      }
    });
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    notification.isRead = true;
    await notification.save();
    
    return notification;
  } catch (error) {
    logger.error(`Error marking notification ${notificationId} as read:`, error);
    throw error;
  }
};

// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (userId) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
    
    return true;
  } catch (error) {
    logger.error(`Error marking all notifications as read for user ${userId}:`, error);
    throw error;
  }
};

// Delete a notification
const deleteNotification = async (notificationId, userId) => {
  try {
    const result = await Notification.destroy({
      where: {
        id: notificationId,
        userId
      }
    });
    
    return result > 0;
  } catch (error) {
    logger.error(`Error deleting notification ${notificationId}:`, error);
    throw error;
  }
};

// Send notification to user
const notifyUser = async (io, userId, data) => {
  try {
    // Create notification in database
    const notification = await createNotification({
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data || {},
      isRead: false
    });
    
    // Send real-time notification if user is online
    if (io && isUserOnline(userId)) {
      sendUserNotification(io, userId, {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        createdAt: notification.createdAt
      });
    }
    
    return notification;
  } catch (error) {
    logger.error(`Error notifying user ${userId}:`, error);
    throw error;
  }
};

// Send notification to all users with a specific role
const notifyRole = async (io, role, data) => {
  try {
    // Get all users with the specified role
    const users = await User.findAll({
      where: { role }
    });
    
    // Create notifications for each user
    const notifications = [];
    for (const user of users) {
      const notification = await createNotification({
        userId: user.id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        isRead: false
      });
      
      notifications.push(notification);
    }
    
    // Send real-time notification to all users with the role
    if (io) {
      sendRoleNotification(io, role, {
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        createdAt: new Date()
      });
    }
    
    return notifications;
  } catch (error) {
    logger.error(`Error notifying users with role ${role}:`, error);
    throw error;
  }
};

// Send notification to all users in a course
const notifyCourse = async (io, courseId, data) => {
  try {
    // Get all users enrolled in the course
    const enrollments = await UserCourse.findAll({
      where: { courseId }
    });
    
    // Create notifications for each enrolled user
    const notifications = [];
    for (const enrollment of enrollments) {
      const notification = await createNotification({
        userId: enrollment.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: { ...data.data, courseId } || { courseId },
        isRead: false
      });
      
      notifications.push(notification);
    }
    
    // Send real-time notification to all users in the course
    if (io) {
      sendCourseNotification(io, courseId, {
        type: data.type,
        title: data.title,
        message: data.message,
        data: { ...data.data, courseId } || { courseId },
        createdAt: new Date()
      });
    }
    
    return notifications;
  } catch (error) {
    logger.error(`Error notifying users in course ${courseId}:`, error);
    throw error;
  }
};

// Send notification to all users
const notifyAll = async (io, data) => {
  try {
    // Get all users
    const users = await User.findAll();
    
    // Create notifications for each user
    const notifications = [];
    for (const user of users) {
      const notification = await createNotification({
        userId: user.id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        isRead: false
      });
      
      notifications.push(notification);
    }
    
    // Send real-time notification to all users
    if (io) {
      sendBroadcastNotification(io, {
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        createdAt: new Date()
      });
    }
    
    return notifications;
  } catch (error) {
    logger.error('Error notifying all users:', error);
    throw error;
  }
};

export {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  notifyUser,
  notifyRole,
  notifyCourse,
  notifyAll
};
