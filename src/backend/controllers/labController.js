import { Lab, Module, LabSubmission, User } from '../models/index.js';
import logger from '../utils/logger.js';

// @desc    Get all labs
// @route   GET /api/labs
// @access  Private
export const getLabs = async (req, res, next) => {
  try {
    const labs = await Lab.findAll({
      where: {
        isPublished: true
      },
      include: [
        {
          model: Module,
          attributes: ['id', 'title', 'courseId']
        }
      ],
      attributes: { 
        exclude: ['instructions', 'environmentConfig', 'createdAt', 'updatedAt'] 
      },
      order: [['title', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: labs.length,
      data: labs
    });
  } catch (error) {
    logger.error('Error fetching labs:', error);
    next(error);
  }
};

// @desc    Get single lab
// @route   GET /api/labs/:id
// @access  Private
export const getLab = async (req, res, next) => {
  try {
    const lab = await Lab.findByPk(req.params.id, {
      include: [
        {
          model: Module,
          attributes: ['id', 'title', 'courseId']
        }
      ]
    });

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }

    // Get user's submissions for this lab
    let submissions = [];
    if (req.user) {
      submissions = await LabSubmission.findAll({
        where: {
          userId: req.user.id,
          labId: lab.id
        },
        order: [['submittedAt', 'DESC']]
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...lab.toJSON(),
        submissions
      }
    });
  } catch (error) {
    logger.error(`Error fetching lab ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Create new lab
// @route   POST /api/modules/:moduleId/labs
// @access  Private/Admin
export const createLab = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    
    // Check if module exists
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }
    
    const lab = await Lab.create({
      ...req.body,
      moduleId
    });

    res.status(201).json({
      success: true,
      data: lab
    });
  } catch (error) {
    logger.error(`Error creating lab for module ${req.params.moduleId}:`, error);
    next(error);
  }
};

// @desc    Update lab
// @route   PUT /api/labs/:id
// @access  Private/Admin
export const updateLab = async (req, res, next) => {
  try {
    const lab = await Lab.findByPk(req.params.id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }

    await lab.update(req.body);

    res.status(200).json({
      success: true,
      data: lab
    });
  } catch (error) {
    logger.error(`Error updating lab ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Delete lab
// @route   DELETE /api/labs/:id
// @access  Private/Admin
export const deleteLab = async (req, res, next) => {
  try {
    const lab = await Lab.findByPk(req.params.id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }

    await lab.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting lab ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Submit lab
// @route   POST /api/labs/:id/submit
// @access  Private
export const submitLab = async (req, res, next) => {
  try {
    const { content, fileUrl } = req.body;
    
    if (!content && !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide submission content or file URL'
      });
    }
    
    const lab = await Lab.findByPk(req.params.id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }

    const submission = await LabSubmission.create({
      userId: req.user.id,
      labId: lab.id,
      content,
      fileUrl,
      status: 'submitted',
      submittedAt: new Date()
    });

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    logger.error(`Error submitting lab ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Get lab submissions
// @route   GET /api/labs/:id/submissions
// @access  Private
export const getLabSubmissions = async (req, res, next) => {
  try {
    const lab = await Lab.findByPk(req.params.id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }

    // For admin users, get all submissions
    // For regular users, get only their own submissions
    const whereClause = {
      labId: lab.id
    };
    
    if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
      whereClause.userId = req.user.id;
    }

    const submissions = await LabSubmission.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['submittedAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    logger.error(`Error fetching submissions for lab ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Grade lab submission
// @route   PUT /api/labs/submissions/:id
// @access  Private/Admin
export const gradeLabSubmission = async (req, res, next) => {
  try {
    const { grade, feedback } = req.body;
    
    if (grade === undefined || grade < 0 || grade > 100) {
      return res.status(400).json({
        success: false,
        message: 'Grade must be a number between 0 and 100'
      });
    }
    
    const submission = await LabSubmission.findByPk(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';
    submission.gradedAt = new Date();
    
    await submission.save();

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    logger.error(`Error grading submission ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Start lab environment
// @route   POST /api/labs/:id/environment/start
// @access  Private
export const startLabEnvironment = async (req, res, next) => {
  try {
    const lab = await Lab.findByPk(req.params.id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }

    // In a real app, this would interact with a lab environment service
    // For now, we'll just return a mock response
    
    res.status(200).json({
      success: true,
      message: 'Lab environment started',
      data: {
        labId: lab.id,
        userId: req.user.id,
        status: 'running',
        accessUrl: `https://labs.example.com/access/${lab.id}/${req.user.id}`,
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
      }
    });
  } catch (error) {
    logger.error(`Error starting lab environment for lab ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Stop lab environment
// @route   POST /api/labs/:id/environment/stop
// @access  Private
export const stopLabEnvironment = async (req, res, next) => {
  try {
    const lab = await Lab.findByPk(req.params.id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }

    // In a real app, this would interact with a lab environment service
    // For now, we'll just return a mock response
    
    res.status(200).json({
      success: true,
      message: 'Lab environment stopped',
      data: {
        labId: lab.id,
        userId: req.user.id,
        status: 'stopped',
        stoppedAt: new Date()
      }
    });
  } catch (error) {
    logger.error(`Error stopping lab environment for lab ${req.params.id}:`, error);
    next(error);
  }
};
