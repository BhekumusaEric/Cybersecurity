import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserDashboard,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import {
  getUserProgress,
  getUserDeadlines,
  getUserActivities
} from '../controllers/userProgressController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for all authenticated users
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/dashboard', getUserDashboard);

// User progress routes
router.get('/progress', getUserProgress);
router.get('/deadlines', getUserDeadlines);
router.get('/activities', getUserActivities);

// Admin-only routes
router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
