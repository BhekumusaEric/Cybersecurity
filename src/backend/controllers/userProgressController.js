import { 
  User, 
  Course, 
  Module, 
  Lab, 
  Assessment, 
  ModuleProgress, 
  LabSubmission, 
  AssessmentAttempt 
} from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

// @desc    Get user's overall progress
// @route   GET /api/users/progress
// @access  Private
export const getUserProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all modules
    const modules = await Module.findAll({
      where: { isPublished: true }
    });

    // Get user's module progress
    const moduleProgress = await ModuleProgress.findAll({
      where: { userId }
    });

    // Calculate module statistics
    const completedModules = moduleProgress.filter(mp => mp.status === 'completed').length;
    const inProgressModules = moduleProgress.filter(mp => mp.status === 'in_progress').length;
    const notStartedModules = modules.length - completedModules - inProgressModules;

    // Calculate overall progress percentage
    const overallProgress = modules.length > 0 
      ? Math.round((completedModules / modules.length) * 100) 
      : 0;

    // Get lab completion data
    const labs = await Lab.findAll();
    const labSubmissions = await LabSubmission.findAll({
      where: { userId }
    });
    const completedLabs = labSubmissions.length;
    const totalLabs = labs.length;

    // Get quiz completion data
    const quizzes = await Assessment.findAll({
      where: { type: 'quiz' }
    });
    const quizAttempts = await AssessmentAttempt.findAll({
      where: { 
        userId,
        passed: true
      }
    });
    const passedQuizzes = quizAttempts.length;
    const totalQuizzes = quizzes.length;

    res.status(200).json({
      success: true,
      data: {
        overallProgress,
        completedModules,
        inProgressModules,
        notStartedModules,
        totalModules: modules.length,
        completedLabs,
        totalLabs,
        passedQuizzes,
        totalQuizzes
      }
    });
  } catch (error) {
    logger.error(`Error fetching user progress for user ${req.user.id}:`, error);
    next(error);
  }
};

// @desc    Get user's upcoming deadlines
// @route   GET /api/users/deadlines
// @access  Private
export const getUserDeadlines = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    
    // Get upcoming assessments with deadlines
    const upcomingAssessments = await Assessment.findAll({
      where: {
        dueDate: {
          [Op.gt]: today
        }
      },
      include: [
        {
          model: Module,
          attributes: ['title']
        }
      ],
      order: [['dueDate', 'ASC']],
      limit: 5
    });
    
    // Format the deadlines
    const deadlines = upcomingAssessments.map(assessment => ({
      id: assessment.id,
      title: assessment.title,
      dueDate: assessment.dueDate,
      type: assessment.type,
      moduleTitle: assessment.Module ? assessment.Module.title : null
    }));
    
    res.status(200).json({
      success: true,
      deadlines
    });
  } catch (error) {
    logger.error(`Error fetching deadlines for user ${req.user.id}:`, error);
    next(error);
  }
};

// @desc    Get user's recent activities
// @route   GET /api/users/activities
// @access  Private
export const getUserActivities = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get recent module progress updates
    const moduleActivities = await ModuleProgress.findAll({
      where: { userId },
      include: [
        {
          model: Module,
          attributes: ['title']
        }
      ],
      order: [['updatedAt', 'DESC']],
      limit: 3
    });
    
    // Get recent lab submissions
    const labActivities = await LabSubmission.findAll({
      where: { userId },
      include: [
        {
          model: Lab,
          attributes: ['title']
        }
      ],
      order: [['submittedAt', 'DESC']],
      limit: 3
    });
    
    // Get recent assessment attempts
    const assessmentActivities = await AssessmentAttempt.findAll({
      where: { userId },
      include: [
        {
          model: Assessment,
          attributes: ['title', 'type']
        }
      ],
      order: [['completedAt', 'DESC']],
      limit: 3
    });
    
    // Combine and format activities
    const activities = [
      ...moduleActivities.map(activity => ({
        id: `module_${activity.id}`,
        title: `${activity.status === 'completed' ? 'Completed' : 'Started'} ${activity.Module.title}`,
        date: activity.updatedAt,
        type: 'module',
        result: activity.status === 'completed' ? 'Completed' : 'In Progress'
      })),
      ...labActivities.map(activity => ({
        id: `lab_${activity.id}`,
        title: `Submitted ${activity.Lab.title}`,
        date: activity.submittedAt,
        type: 'lab',
        result: activity.status === 'graded' ? `Graded (${activity.grade}%)` : 'Pending Review'
      })),
      ...assessmentActivities.map(activity => ({
        id: `assessment_${activity.id}`,
        title: `Completed ${activity.Assessment.title}`,
        date: activity.completedAt,
        type: activity.Assessment.type,
        result: activity.passed ? `Passed (${activity.score}%)` : `Failed (${activity.score}%)`
      }))
    ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
    
    res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    logger.error(`Error fetching activities for user ${req.user.id}:`, error);
    next(error);
  }
};
