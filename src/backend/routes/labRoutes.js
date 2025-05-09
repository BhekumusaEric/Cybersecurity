import express from 'express';
import {
  getLabs,
  getLab,
  createLab,
  updateLab,
  deleteLab,
  submitLab,
  getLabSubmissions,
  gradeLabSubmission,
  startLabEnvironment,
  stopLabEnvironment
} from '../controllers/labController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// Protected routes
router.use(protect);

// Routes for all authenticated users
router.get('/', getLabs);
router.get('/:id', getLab);
router.post('/:id/submit', submitLab);
router.post('/:id/environment/start', startLabEnvironment);
router.post('/:id/environment/stop', stopLabEnvironment);

// Admin/instructor routes
router.get('/:id/submissions', authorize('admin', 'instructor'), getLabSubmissions);
router.put('/submissions/:id', authorize('admin', 'instructor'), gradeLabSubmission);

// Admin-only routes
router.post('/', authorize('admin', 'instructor'), createLab);
router.put('/:id', authorize('admin', 'instructor'), updateLab);
router.delete('/:id', authorize('admin'), deleteLab);

export default router;
