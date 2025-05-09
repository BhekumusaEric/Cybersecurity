import { Module, Course, Lab, Assessment, User } from '../models/index.js';
import logger from '../utils/logger.js';
import { sequelize } from '../config/database.js';

// @desc    Get all modules for a course
// @route   GET /api/courses/:courseId/modules
// @access  Private
export const getModules = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    
    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const modules = await Module.findAll({
      where: {
        courseId,
        isPublished: true
      },
      attributes: { 
        exclude: ['content', 'createdAt', 'updatedAt'] 
      },
      order: [['order', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules
    });
  } catch (error) {
    logger.error(`Error fetching modules for course ${req.params.courseId}:`, error);
    next(error);
  }
};

// @desc    Get single module
// @route   GET /api/modules/:id
// @access  Private
export const getModule = async (req, res, next) => {
  try {
    const module = await Module.findByPk(req.params.id, {
      include: [
        {
          model: Course,
          attributes: ['id', 'title']
        },
        {
          model: Lab,
          attributes: ['id', 'title', 'description']
        },
        {
          model: Assessment,
          attributes: ['id', 'title', 'description', 'type']
        }
      ]
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Get user's progress for this module
    let progress = 0;
    if (req.user) {
      // In a real app, you would have a ModuleProgress model to track this
      // For now, we'll return a mock progress value
      progress = Math.floor(Math.random() * 101); // 0-100
    }

    // Get next and previous modules
    const adjacentModules = await Module.findAll({
      where: {
        courseId: module.courseId,
        isPublished: true
      },
      attributes: ['id', 'title', 'order'],
      order: [['order', 'ASC']]
    });

    const currentIndex = adjacentModules.findIndex(m => m.id === module.id);
    const prevModule = currentIndex > 0 ? adjacentModules[currentIndex - 1] : null;
    const nextModule = currentIndex < adjacentModules.length - 1 ? adjacentModules[currentIndex + 1] : null;

    res.status(200).json({
      success: true,
      data: {
        ...module.toJSON(),
        progress,
        prevModule,
        nextModule
      }
    });
  } catch (error) {
    logger.error(`Error fetching module ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Create new module
// @route   POST /api/courses/:courseId/modules
// @access  Private/Admin
export const createModule = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    
    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Get the highest order value to place the new module at the end
    const highestOrder = await Module.max('order', {
      where: { courseId }
    }) || 0;
    
    const module = await Module.create({
      ...req.body,
      courseId,
      order: highestOrder + 1
    });

    res.status(201).json({
      success: true,
      data: module
    });
  } catch (error) {
    logger.error(`Error creating module for course ${req.params.courseId}:`, error);
    next(error);
  }
};

// @desc    Update module
// @route   PUT /api/modules/:id
// @access  Private/Admin
export const updateModule = async (req, res, next) => {
  try {
    const module = await Module.findByPk(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    await module.update(req.body);

    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    logger.error(`Error updating module ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Delete module
// @route   DELETE /api/modules/:id
// @access  Private/Admin
export const deleteModule = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const module = await Module.findByPk(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    const courseId = module.courseId;
    const deletedOrder = module.order;

    // Delete the module
    await module.destroy({ transaction });

    // Reorder remaining modules
    await Module.update(
      { order: sequelize.literal('order - 1') },
      { 
        where: { 
          courseId,
          order: { [Op.gt]: deletedOrder }
        },
        transaction
      }
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error deleting module ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Reorder modules
// @route   PUT /api/courses/:courseId/modules/reorder
// @access  Private/Admin
export const reorderModules = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { courseId } = req.params;
    const { moduleOrder } = req.body;
    
    if (!Array.isArray(moduleOrder)) {
      return res.status(400).json({
        success: false,
        message: 'moduleOrder must be an array of module IDs'
      });
    }
    
    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if all modules exist and belong to the course
    const modules = await Module.findAll({
      where: {
        id: moduleOrder,
        courseId
      }
    });
    
    if (modules.length !== moduleOrder.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more module IDs are invalid or do not belong to this course'
      });
    }
    
    // Update order for each module
    for (let i = 0; i < moduleOrder.length; i++) {
      await Module.update(
        { order: i + 1 },
        { 
          where: { id: moduleOrder[i] },
          transaction
        }
      );
    }
    
    await transaction.commit();
    
    // Get updated modules
    const updatedModules = await Module.findAll({
      where: { courseId },
      order: [['order', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: updatedModules
    });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error reordering modules for course ${req.params.courseId}:`, error);
    next(error);
  }
};

// @desc    Mark module as completed
// @route   POST /api/modules/:id/complete
// @access  Private
export const completeModule = async (req, res, next) => {
  try {
    const module = await Module.findByPk(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // In a real app, you would update a ModuleProgress model
    // For now, we'll just return a success response
    
    res.status(200).json({
      success: true,
      message: 'Module marked as completed',
      data: {
        moduleId: module.id,
        userId: req.user.id,
        completedAt: new Date()
      }
    });
  } catch (error) {
    logger.error(`Error completing module ${req.params.id}:`, error);
    next(error);
  }
};

// @desc    Get module progress
// @route   GET /api/modules/:id/progress
// @access  Private
export const getModuleProgress = async (req, res, next) => {
  try {
    const module = await Module.findByPk(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // In a real app, you would fetch from a ModuleProgress model
    // For now, we'll return mock data
    const progress = {
      moduleId: module.id,
      userId: req.user.id,
      progress: Math.floor(Math.random() * 101), // 0-100
      lastAccessed: new Date(),
      completedAt: null
    };

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    logger.error(`Error fetching progress for module ${req.params.id}:`, error);
    next(error);
  }
};
