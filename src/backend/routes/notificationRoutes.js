import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  sendUserNotification,
  sendRoleNotification,
  sendCourseNotification,
  sendBroadcastNotification
} from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for all authenticated users
router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', removeNotification);

// Admin-only routes
router.post('/user/:userId', authorize('admin', 'instructor'), sendUserNotification);
router.post('/role/:role', authorize('admin'), sendRoleNotification);
router.post('/course/:courseId', authorize('admin', 'instructor'), sendCourseNotification);
router.post('/broadcast', authorize('admin'), sendBroadcastNotification);

export default router;
