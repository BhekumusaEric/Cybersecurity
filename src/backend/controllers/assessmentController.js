import { Assessment, Module, AssessmentAttempt, User } from '../models/index.js';
import logger from '../utils/logger.js';

// @desc    Get all assessments
// @route   GET /api/assessments
// @access  Private
export const getAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.findAll({
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
        exclude: ['questions', 'createdAt', 'updatedAt'] 
      },
      order: [['title', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    logger.error('Error fetching assessments:', error);
    next(error);
  }
};

// @desc    Get single assessment
// @route   GET /api/assessments/:id
// @access  Private
export const getAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id, {
      include: [
        {
          model: Module,
          attributes: ['id', 'title', 'courseId']
        }
      ]
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Get user's attempts for this assessment
    let attempts = [];
    if (req.user) {
      attempts = await AssessmentAttempt.findAll({
        where: {
          userId: req.user.id,
          assessmentId: assessment.id
        },
        order: [['startedAt', 'DESC']]
      });
    }

    // For non-admin users, remove correct answers if not allowed
    let assessmentData = assessment.toJSON();
    if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
      if (assessment.showAnswers === 'never' || 
         (assessment.showAnswers === 'after_due_date' && assessment.dueDate && new Date() < assessment.dueDate)) {
        // Remove correct answers from questions
        if (assessmentData.questions && Array.isArray(assessmentData.questions)) {
          assessmentData.questions = assessmentData.questions.map(question => {
            const { correctAnswer, ...rest } = question;
            return rest;
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...assessmentData,
        attempts
      }
    });
  } catch (error) {
    logger.error(`Error fetching assessment ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Create new assessment
// @route   POST /api/modules/:moduleId/assessments
// @access  Private/Admin
export const createAssessment = async (req, res, next) => {
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
    
    const assessment = await Assessment.create({
      ...req.body,
      moduleId
    });

    res.status(201).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    logger.error(`Error creating assessment for module ${req.params.moduleId}:`, error);
    next(error);
  }
};

// @desc    Update assessment
// @route   PUT /api/assessments/:id
// @access  Private/Admin
export const updateAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    await assessment.update(req.body);

    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    logger.error(`Error updating assessment ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Delete assessment
// @route   DELETE /api/assessments/:id
// @access  Private/Admin
export const deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    await assessment.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting assessment ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Start assessment attempt
// @route   POST /api/assessments/:id/attempt
// @access  Private
export const startAssessmentAttempt = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check if user has reached maximum attempts
    const attemptCount = await AssessmentAttempt.count({
      where: {
        userId: req.user.id,
        assessmentId: assessment.id
      }
    });

    if (assessment.maxAttempts > 0 && attemptCount >= assessment.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: `Maximum number of attempts (${assessment.maxAttempts}) reached`
      });
    }

    // Check if due date has passed
    if (assessment.dueDate && new Date() > new Date(assessment.dueDate)) {
      return res.status(400).json({
        success: false,
        message: 'Assessment due date has passed'
      });
    }

    // Create a new attempt
    const attempt = await AssessmentAttempt.create({
      userId: req.user.id,
      assessmentId: assessment.id,
      startedAt: new Date()
    });

    // Prepare questions (randomize if needed)
    let questions = [...assessment.questions];
    if (assessment.randomizeQuestions && Array.isArray(questions)) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    // Remove correct answers from questions
    const questionsWithoutAnswers = questions.map(question => {
      const { correctAnswer, ...rest } = question;
      return rest;
    });

    res.status(201).json({
      success: true,
      data: {
        attempt,
        questions: questionsWithoutAnswers,
        timeLimit: assessment.timeLimit
      }
    });
  } catch (error) {
    logger.error(`Error starting assessment attempt for ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Submit assessment attempt
// @route   POST /api/assessments/attempts/:id
// @access  Private
export const submitAssessmentAttempt = async (req, res, next) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers array'
      });
    }
    
    const attempt = await AssessmentAttempt.findByPk(req.params.id);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found'
      });
    }

    // Verify this is the user's attempt
    if (attempt.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this attempt'
      });
    }

    // Check if attempt is already completed
    if (attempt.completedAt) {
      return res.status(400).json({
        success: false,
        message: 'This attempt has already been submitted'
      });
    }

    // Get assessment to grade the answers
    const assessment = await Assessment.findByPk(attempt.assessmentId);
    
    // Calculate score
    let correctCount = 0;
    const questions = assessment.questions;
    
    if (Array.isArray(questions) && Array.isArray(answers)) {
      for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        const question = questions.find(q => q.id === answer.questionId);
        
        if (question && answer.selectedOption === question.correctAnswer) {
          correctCount++;
        }
      }
    }
    
    const totalQuestions = questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= assessment.passingScore;
    
    // Calculate time spent
    const startTime = new Date(attempt.startedAt).getTime();
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds
    
    // Update attempt
    attempt.answers = answers;
    attempt.score = score;
    attempt.passed = passed;
    attempt.completedAt = new Date();
    attempt.timeSpent = timeSpent;
    
    await attempt.save();

    // Determine if answers should be shown
    let showCorrectAnswers = false;
    if (assessment.showAnswers === 'after_submission' || 
       (assessment.showAnswers === 'after_due_date' && assessment.dueDate && new Date() >= assessment.dueDate)) {
      showCorrectAnswers = true;
    }

    res.status(200).json({
      success: true,
      data: {
        attempt,
        score,
        passed,
        correctCount,
        totalQuestions,
        timeSpent,
        correctAnswers: showCorrectAnswers ? questions.map(q => ({ 
          questionId: q.id, 
          correctAnswer: q.correctAnswer 
        })) : null
      }
    });
  } catch (error) {
    logger.error(`Error submitting assessment attempt ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Get assessment attempts
// @route   GET /api/assessments/:id/attempts
// @access  Private/Admin
export const getAssessmentAttempts = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // For admin/instructor, get all attempts
    // For regular users, get only their own attempts
    const whereClause = {
      assessmentId: assessment.id
    };
    
    if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
      whereClause.userId = req.user.id;
    }

    const attempts = await AssessmentAttempt.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['startedAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    logger.error(`Error fetching attempts for assessment ${req.params.id}:`, error);
    next(error);
  }
};
