import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  notifyUser,
  notifyRole,
  notifyCourse,
  notifyAll
} from '../services/notificationService.js';
import logger from '../utils/logger.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const { limit, offset, includeRead } = req.query;
    
    const options = {
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
      includeRead: includeRead === 'true'
    };
    
    const notifications = await getUserNotifications(req.user.id, options);
    
    res.status(200).json({
      success: true,
      count: notifications.count,
      data: notifications.rows
    });
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await markNotificationAsRead(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error(`Error marking notification ${req.params.id} as read:`, error);
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    await markAllNotificationsAsRead(req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const removeNotification = async (req, res, next) => {
  try {
    const success = await deleteNotification(req.params.id, req.user.id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting notification ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Send notification to user
// @route   POST /api/notifications/user/:userId
// @access  Private/Admin
export const sendUserNotification = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { type, title, message, data } = req.body;
    
    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, title, and message'
      });
    }
    
    const notification = await notifyUser(req.app.get('io'), userId, {
      type,
      title,
      message,
      data
    });
    
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error(`Error sending notification to user ${req.params.userId}:`, error);
    next(error);
  }
};

// @desc    Send notification to role
// @route   POST /api/notifications/role/:role
// @access  Private/Admin
export const sendRoleNotification = async (req, res, next) => {
  try {
    const { role } = req.params;
    const { type, title, message, data } = req.body;
    
    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, title, and message'
      });
    }
    
    const notifications = await notifyRole(req.app.get('io'), role, {
      type,
      title,
      message,
      data
    });
    
    res.status(201).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    logger.error(`Error sending notification to role ${req.params.role}:`, error);
    next(error);
  }
};

// @desc    Send notification to course
// @route   POST /api/notifications/course/:courseId
// @access  Private/Admin
export const sendCourseNotification = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { type, title, message, data } = req.body;
    
    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, title, and message'
      });
    }
    
    const notifications = await notifyCourse(req.app.get('io'), courseId, {
      type,
      title,
      message,
      data
    });
    
    res.status(201).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    logger.error(`Error sending notification to course ${req.params.courseId}:`, error);
    next(error);
  }
};

// @desc    Send notification to all users
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
export const sendBroadcastNotification = async (req, res, next) => {
  try {
    const { type, title, message, data } = req.body;
    
    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, title, and message'
      });
    }
    
    const notifications = await notifyAll(req.app.get('io'), {
      type,
      title,
      message,
      data
    });
    
    res.status(201).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    logger.error('Error sending broadcast notification:', error);
    next(error);
  }
};
