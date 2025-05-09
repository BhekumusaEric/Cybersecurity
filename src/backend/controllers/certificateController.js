import {
  generateCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  revokeCertificate
} from '../services/certificateService.js';
import logger from '../utils/logger.js';

// @desc    Generate certificate for a course
// @route   POST /api/certificates/generate/:courseId
// @access  Private
export const generateUserCertificate = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    
    const certificate = await generateCertificate(req.user.id, courseId, req.app.get('io'));
    
    res.status(201).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    logger.error(`Error generating certificate for course ${req.params.courseId}:`, error);
    next(error);
  }
};

// @desc    Get user certificates
// @route   GET /api/certificates
// @access  Private
export const getUserCertificatesList = async (req, res, next) => {
  try {
    const certificates = await getUserCertificates(req.user.id);
    
    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    logger.error('Error fetching user certificates:', error);
    next(error);
  }
};

// @desc    Get certificate by ID
// @route   GET /api/certificates/:id
// @access  Private
export const getCertificate = async (req, res, next) => {
  try {
    const certificate = await getCertificateById(req.params.id);
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    
    // Check if user is authorized to view this certificate
    if (certificate.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this certificate'
      });
    }
    
    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    logger.error(`Error fetching certificate ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Verify certificate by number
// @route   GET /api/certificates/verify/:certificateNumber
// @access  Public
export const verifyCertificateByNumber = async (req, res, next) => {
  try {
    const { certificateNumber } = req.params;
    
    const result = await verifyCertificate(certificateNumber);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error(`Error verifying certificate ${req.params.certificateNumber}:`, error);
    next(error);
  }
};

// @desc    Revoke certificate
// @route   PUT /api/certificates/:id/revoke
// @access  Private/Admin
export const revokeCertificateById = async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for revocation'
      });
    }
    
    const certificate = await revokeCertificate(req.params.id, reason);
    
    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    logger.error(`Error revoking certificate ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Generate certificates for all eligible users (admin only)
// @route   POST /api/certificates/generate-batch/:courseId
// @access  Private/Admin
export const generateBatchCertificates = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    
    // Get all users who have completed the course
    const completedEnrollments = await UserCourse.findAll({
      where: {
        courseId,
        progress: 100
      }
    });
    
    if (completedEnrollments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No eligible users found for certificate generation'
      });
    }
    
    // Generate certificates for each user
    const certificates = [];
    const errors = [];
    
    for (const enrollment of completedEnrollments) {
      try {
        const certificate = await generateCertificate(enrollment.userId, courseId, req.app.get('io'));
        certificates.push(certificate);
      } catch (error) {
        errors.push({
          userId: enrollment.userId,
          error: error.message
        });
      }
    }
    
    res.status(200).json({
      success: true,
      count: certificates.length,
      data: {
        certificates,
        errors
      }
    });
  } catch (error) {
    logger.error(`Error generating batch certificates for course ${req.params.courseId}:`, error);
    next(error);
  }
};
