import { User, Course, UserCourse, LabSubmission, AssessmentAttempt } from '../models/index.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcryptjs';

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] }
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    const { name, email, password, profilePicture, bio } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;
    if (bio) user.bio = bio;

    // Handle password update separately
    if (password) {
      user.password = password; // Will be hashed by the model hook
    }

    await user.save();

    // Return user without sensitive fields
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] }
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    next(error);
  }
};

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
export const getUserDashboard = async (req, res, next) => {
  try {
    // Get enrolled courses with progress
    const enrollments = await UserCourse.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: Course,
          attributes: ['id', 'title', 'thumbnail', 'level']
        }
      ],
      limit: 5,
      order: [['updatedAt', 'DESC']]
    });

    // Get recent lab submissions
    const labSubmissions = await LabSubmission.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: Lab,
          attributes: ['id', 'title', 'moduleId']
        }
      ],
      limit: 5,
      order: [['submittedAt', 'DESC']]
    });

    // Get recent assessment attempts
    const assessmentAttempts = await AssessmentAttempt.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: Assessment,
          attributes: ['id', 'title', 'type', 'moduleId']
        }
      ],
      limit: 5,
      order: [['startedAt', 'DESC']]
    });

    // Calculate overall progress
    const allEnrollments = await UserCourse.findAll({
      where: {
        userId: req.user.id
      }
    });

    const totalCourses = allEnrollments.length;
    const completedCourses = allEnrollments.filter(e => e.completedAt).length;
    const overallProgress = totalCourses > 0 
      ? Math.round((completedCourses / totalCourses) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        recentCourses: enrollments.map(e => ({
          id: e.Course.id,
          title: e.Course.title,
          thumbnail: e.Course.thumbnail,
          level: e.Course.level,
          progress: e.progress,
          enrolledAt: e.enrolledAt,
          completedAt: e.completedAt
        })),
        recentLabSubmissions: labSubmissions,
        recentAssessmentAttempts: assessmentAttempts,
        stats: {
          totalCourses,
          completedCourses,
          overallProgress,
          totalLabSubmissions: await LabSubmission.count({ where: { userId: req.user.id } }),
          totalAssessmentAttempts: await AssessmentAttempt.count({ where: { userId: req.user.id } }),
          passedAssessments: await AssessmentAttempt.count({ 
            where: { 
              userId: req.user.id,
              passed: true
            } 
          })
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching user dashboard data:', error);
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] }
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Error fetching user ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    const { name, email, role, isActive } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    // Return user without sensitive fields
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] }
    });

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    logger.error(`Error updating user ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting user ${req.params.id}:`, error);
    next(error);
  }
};
