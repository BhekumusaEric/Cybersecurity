import { Certificate, User, Course, UserCourse } from '../models/index.js';
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { notifyUser } from './notificationService.js';
import logger from '../utils/logger.js';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Register fonts for certificate generation
const registerFonts = () => {
  const fontsDir = path.join(process.cwd(), 'assets', 'fonts');
  
  try {
    registerFont(path.join(fontsDir, 'OpenSans-Regular.ttf'), { family: 'Open Sans' });
    registerFont(path.join(fontsDir, 'OpenSans-Bold.ttf'), { family: 'Open Sans Bold' });
    registerFont(path.join(fontsDir, 'Montserrat-Regular.ttf'), { family: 'Montserrat' });
    registerFont(path.join(fontsDir, 'Montserrat-Bold.ttf'), { family: 'Montserrat Bold' });
  } catch (error) {
    logger.error('Error registering fonts:', error);
  }
};

// Register fonts on module load
registerFonts();

// Generate certificate image
const generateCertificateImage = async (certificateData) => {
  try {
    const { userName, courseName, certificateNumber, issueDate } = certificateData;
    
    // Create canvas
    const width = 1754;
    const height = 1240;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Load certificate template
    const templatePath = path.join(process.cwd(), 'assets', 'images', 'certificate-template.png');
    const template = await loadImage(templatePath);
    
    // Draw template
    ctx.drawImage(template, 0, 0, width, height);
    
    // Set text styles
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333333';
    
    // Draw certificate title
    ctx.font = '60px "Montserrat Bold"';
    ctx.fillText('CERTIFICATE OF COMPLETION', width / 2, 300);
    
    // Draw recipient name
    ctx.font = '80px "Montserrat Bold"';
    ctx.fillText(userName, width / 2, 500);
    
    // Draw course completion text
    ctx.font = '30px "Open Sans"';
    ctx.fillText('has successfully completed the course', width / 2, 580);
    
    // Draw course name
    ctx.font = '50px "Montserrat Bold"';
    ctx.fillText(courseName, width / 2, 680);
    
    // Draw issue date
    const formattedDate = new Date(issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.font = '30px "Open Sans"';
    ctx.fillText(`Issued on ${formattedDate}`, width / 2, 780);
    
    // Draw certificate number
    ctx.font = '20px "Open Sans"';
    ctx.fillText(`Certificate ID: ${certificateNumber}`, width / 2, 830);
    
    // Generate QR code for verification
    const verificationUrl = `${process.env.FRONTEND_URL || 'https://localhost'}/verify/${certificateNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 150,
      margin: 1,
      color: {
        dark: '#333333',
        light: '#ffffff'
      }
    });
    
    // Load QR code image
    const qrCodeImage = await loadImage(qrCodeDataUrl);
    
    // Draw QR code
    ctx.drawImage(qrCodeImage, width / 2 - 75, 880, 150, 150);
    
    // Draw verification text
    ctx.font = '18px "Open Sans"';
    ctx.fillText('Scan to verify certificate authenticity', width / 2, 1060);
    
    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png');
    
    return buffer;
  } catch (error) {
    logger.error('Error generating certificate image:', error);
    throw error;
  }
};

// Upload certificate to S3
const uploadCertificateToS3 = async (certificateBuffer, certificateNumber) => {
  try {
    const key = `certificates/${certificateNumber}.png`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: certificateBuffer,
      ContentType: 'image/png',
      ACL: 'public-read'
    });
    
    await s3Client.send(command);
    
    // Return the S3 URL
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    logger.error('Error uploading certificate to S3:', error);
    throw error;
  }
};

// Generate and issue certificate
const generateCertificate = async (userId, courseId, io = null) => {
  try {
    // Check if user has completed the course
    const enrollment = await UserCourse.findOne({
      where: {
        userId,
        courseId,
        progress: 100
      }
    });
    
    if (!enrollment) {
      throw new Error('User has not completed this course');
    }
    
    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      where: {
        userId,
        courseId,
        status: 'active'
      }
    });
    
    if (existingCertificate) {
      return existingCertificate;
    }
    
    // Get user and course data
    const user = await User.findByPk(userId);
    const course = await Course.findByPk(courseId);
    
    if (!user || !course) {
      throw new Error('User or course not found');
    }
    
    // Create certificate record
    const certificate = await Certificate.create({
      userId,
      courseId,
      issueDate: new Date(),
      expiryDate: null, // No expiry for now
      status: 'active',
      metadata: {
        courseDuration: course.duration,
        courseLevel: course.level,
        completionDate: enrollment.completedAt
      }
    });
    
    // Generate certificate image
    const certificateBuffer = await generateCertificateImage({
      userName: user.name,
      courseName: course.title,
      certificateNumber: certificate.certificateNumber,
      issueDate: certificate.issueDate
    });
    
    // Upload certificate to S3
    const fileUrl = await uploadCertificateToS3(certificateBuffer, certificate.certificateNumber);
    
    // Update certificate with file URL
    certificate.fileUrl = fileUrl;
    await certificate.save();
    
    // Send notification to user
    if (io) {
      await notifyUser(io, userId, {
        type: 'certificate',
        title: 'Certificate Issued',
        message: `Your certificate for ${course.title} has been issued.`,
        data: {
          certificateId: certificate.id,
          courseId: course.id
        }
      });
    }
    
    return certificate;
  } catch (error) {
    logger.error('Error generating certificate:', error);
    throw error;
  }
};

// Get user certificates
const getUserCertificates = async (userId) => {
  try {
    const certificates = await Certificate.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          attributes: ['id', 'title', 'level', 'thumbnail']
        }
      ],
      order: [['issueDate', 'DESC']]
    });
    
    return certificates;
  } catch (error) {
    logger.error(`Error getting certificates for user ${userId}:`, error);
    throw error;
  }
};

// Get certificate by ID
const getCertificateById = async (id) => {
  try {
    const certificate = await Certificate.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Course,
          attributes: ['id', 'title', 'level', 'thumbnail']
        }
      ]
    });
    
    return certificate;
  } catch (error) {
    logger.error(`Error getting certificate ${id}:`, error);
    throw error;
  }
};

// Verify certificate by number
const verifyCertificate = async (certificateNumber) => {
  try {
    const certificate = await Certificate.findOne({
      where: { certificateNumber },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Course,
          attributes: ['id', 'title', 'level', 'thumbnail']
        }
      ]
    });
    
    if (!certificate) {
      return { valid: false, message: 'Certificate not found' };
    }
    
    if (certificate.status !== 'active') {
      return { valid: false, message: `Certificate is ${certificate.status}` };
    }
    
    if (certificate.expiryDate && new Date() > new Date(certificate.expiryDate)) {
      return { valid: false, message: 'Certificate has expired' };
    }
    
    return {
      valid: true,
      certificate: {
        id: certificate.id,
        certificateNumber: certificate.certificateNumber,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        status: certificate.status,
        user: {
          name: certificate.User.name
        },
        course: {
          title: certificate.Course.title,
          level: certificate.Course.level
        }
      }
    };
  } catch (error) {
    logger.error(`Error verifying certificate ${certificateNumber}:`, error);
    throw error;
  }
};

// Revoke certificate
const revokeCertificate = async (id, reason) => {
  try {
    const certificate = await Certificate.findByPk(id);
    
    if (!certificate) {
      throw new Error('Certificate not found');
    }
    
    certificate.status = 'revoked';
    certificate.metadata = {
      ...certificate.metadata,
      revocationReason: reason,
      revokedAt: new Date()
    };
    
    await certificate.save();
    
    return certificate;
  } catch (error) {
    logger.error(`Error revoking certificate ${id}:`, error);
    throw error;
  }
};

export {
  generateCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  revokeCertificate
};
