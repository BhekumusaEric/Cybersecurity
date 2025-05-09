import express from 'express';
import {
  generateUserCertificate,
  getUserCertificatesList,
  getCertificate,
  verifyCertificateByNumber,
  revokeCertificateById,
  generateBatchCertificates
} from '../controllers/certificateController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/verify/:certificateNumber', verifyCertificateByNumber);

// Protected routes
router.use(protect);

// Routes for all authenticated users
router.get('/', getUserCertificatesList);
router.get('/:id', getCertificate);
router.post('/generate/:courseId', generateUserCertificate);

// Admin-only routes
router.put('/:id/revoke', authorize('admin'), revokeCertificateById);
router.post('/generate-batch/:courseId', authorize('admin'), generateBatchCertificates);

export default router;
