import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

// Map to store active user connections
const userConnections = new Map();

// Initialize Socket.IO server
const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL || 'https://localhost' 
        : 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    const userId = socket.user.id;
    
    logger.info(`User connected: ${userId}`);
    
    // Store user connection
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Set());
    }
    userConnections.get(userId).add(socket.id);
    
    // Join user-specific room
    socket.join(`user:${userId}`);
    
    // Join role-specific room
    if (socket.user.role) {
      socket.join(`role:${socket.user.role}`);
    }
    
    // Disconnect handler
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${userId}`);
      
      // Remove user connection
      if (userConnections.has(userId)) {
        userConnections.get(userId).delete(socket.id);
        if (userConnections.get(userId).size === 0) {
          userConnections.delete(userId);
        }
      }
    });
    
    // Join course room
    socket.on('join:course', (courseId) => {
      socket.join(`course:${courseId}`);
      logger.info(`User ${userId} joined course room: ${courseId}`);
    });
    
    // Leave course room
    socket.on('leave:course', (courseId) => {
      socket.leave(`course:${courseId}`);
      logger.info(`User ${userId} left course room: ${courseId}`);
    });
  });

  return io;
};

// Send notification to specific user
const sendUserNotification = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification', notification);
  logger.info(`Notification sent to user ${userId}`);
};

// Send notification to all users with specific role
const sendRoleNotification = (io, role, notification) => {
  io.to(`role:${role}`).emit('notification', notification);
  logger.info(`Notification sent to all users with role ${role}`);
};

// Send notification to all users in a course
const sendCourseNotification = (io, courseId, notification) => {
  io.to(`course:${courseId}`).emit('course:notification', notification);
  logger.info(`Notification sent to course ${courseId}`);
};

// Send notification to all users
const sendBroadcastNotification = (io, notification) => {
  io.emit('notification', notification);
  logger.info('Broadcast notification sent to all users');
};

// Check if user is online
const isUserOnline = (userId) => {
  return userConnections.has(userId);
};

// Get number of online users
const getOnlineUsersCount = () => {
  return userConnections.size;
};

export {
  initSocketServer,
  sendUserNotification,
  sendRoleNotification,
  sendCourseNotification,
  sendBroadcastNotification,
  isUserOnline,
  getOnlineUsersCount
};
