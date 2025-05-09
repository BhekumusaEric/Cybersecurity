import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  updateCourseProgress,
  searchCourses
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for all authenticated users
router.get('/search', searchCourses);
router.get('/enrolled', getEnrolledCourses);
router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/:id/enroll', enrollCourse);
router.put('/:id/progress', updateCourseProgress);

// Admin-only routes
router.post('/', authorize('admin', 'instructor'), createCourse);
router.put('/:id', authorize('admin', 'instructor'), updateCourse);
router.delete('/:id', authorize('admin'), deleteCourse);

export default router;
