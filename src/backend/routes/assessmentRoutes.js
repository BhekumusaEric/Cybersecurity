import express from 'express';
import {
  getAssessments,
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  startAssessmentAttempt,
  submitAssessmentAttempt,
  getAssessmentAttempts
} from '../controllers/assessmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// Protected routes
router.use(protect);

// Routes for all authenticated users
router.get('/', getAssessments);
router.get('/:id', getAssessment);
router.post('/:id/attempt', startAssessmentAttempt);
router.post('/attempts/:id', submitAssessmentAttempt);

// Admin/instructor routes
router.get('/:id/attempts', authorize('admin', 'instructor'), getAssessmentAttempts);

// Admin-only routes
router.post('/', authorize('admin', 'instructor'), createAssessment);
router.put('/:id', authorize('admin', 'instructor'), updateAssessment);
router.delete('/:id', authorize('admin'), deleteAssessment);

export default router;
