import { Course, Module, User, UserCourse } from '../models/index.js';
import logger from '../utils/logger.js';
import { Op } from 'sequelize';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      where: {
        isPublished: true
      },
      attributes: { 
        exclude: ['createdAt', 'updatedAt'] 
      },
      order: [['title', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    logger.error('Error fetching courses:', error);
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: Module,
          attributes: ['id', 'title', 'description', 'order', 'duration', 'isPublished'],
          order: [['order', 'ASC']]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get user's enrollment status and progress
    let enrollment = null;
    if (req.user) {
      enrollment = await UserCourse.findOne({
        where: {
          userId: req.user.id,
          courseId: course.id
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...course.toJSON(),
        isEnrolled: !!enrollment,
        progress: enrollment ? enrollment.progress : 0,
        enrolledAt: enrollment ? enrollment.enrolledAt : null,
        completedAt: enrollment ? enrollment.completedAt : null
      }
    });
  } catch (error) {
    logger.error(`Error fetching course ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    logger.error('Error creating course:', error);
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await course.update(req.body);

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    logger.error(`Error updating course ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await course.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting course ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
export const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await UserCourse.findOne({
      where: {
        userId: req.user.id,
        courseId: course.id
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await UserCourse.create({
      userId: req.user.id,
      courseId: course.id,
      role: 'student',
      enrolledAt: new Date(),
      progress: 0
    });

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    logger.error(`Error enrolling in course ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/courses/enrolled
// @access  Private
export const getEnrolledCourses = async (req, res, next) => {
  try {
    const enrollments = await UserCourse.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        {
          model: Course,
          attributes: ['id', 'title', 'description', 'thumbnail', 'duration', 'level']
        }
      ]
    });

    const courses = enrollments.map(enrollment => ({
      ...enrollment.Course.toJSON(),
      progress: enrollment.progress,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt
    }));

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    logger.error('Error fetching enrolled courses:', error);
    next(error);
  }
};

// @desc    Update course progress
// @route   PUT /api/courses/:id/progress
// @access  Private
export const updateCourseProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;
    
    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be a number between 0 and 100'
      });
    }

    const enrollment = await UserCourse.findOne({
      where: {
        userId: req.user.id,
        courseId: req.params.id
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Update progress
    enrollment.progress = progress;
    
    // If progress is 100%, mark as completed
    if (progress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }
    
    await enrollment.save();

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    logger.error(`Error updating course progress for ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Search courses
// @route   GET /api/courses/search
// @access  Private
export const searchCourses = async (req, res, next) => {
  try {
    const { query, level, tags } = req.query;
    
    const whereClause = {
      isPublished: true
    };
    
    if (query) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } }
      ];
    }
    
    if (level) {
      whereClause.level = level;
    }
    
    if (tags) {
      const tagArray = tags.split(',');
      whereClause.tags = { [Op.overlap]: tagArray };
    }
    
    const courses = await Course.findAll({
      where: whereClause,
      attributes: { 
        exclude: ['createdAt', 'updatedAt'] 
      },
      order: [['title', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    logger.error('Error searching courses:', error);
    next(error);
  }
};
