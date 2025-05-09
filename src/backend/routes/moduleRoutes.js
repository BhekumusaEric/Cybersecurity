import express from 'express';
import {
  getModules,
  getModule,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
  completeModule,
  getModuleProgress
} from '../controllers/moduleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// Protected routes
router.use(protect);

// Routes for all authenticated users
router.get('/', getModules);
router.get('/:id', getModule);
router.post('/:id/complete', completeModule);
router.get('/:id/progress', getModuleProgress);

// Admin-only routes
router.post('/', authorize('admin', 'instructor'), createModule);
router.put('/:id', authorize('admin', 'instructor'), updateModule);
router.delete('/:id', authorize('admin'), deleteModule);
router.put('/reorder', authorize('admin', 'instructor'), reorderModules);

export default router;
