import express from 'express';
import {
  register,
  login,
  verifyToken,
  forgotPassword,
  resetPassword,
  logout
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/verify', protect, verifyToken);
router.get('/logout', protect, logout);

export default router;
