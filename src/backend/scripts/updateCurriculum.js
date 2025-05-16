import { sequelize } from '../config/database.js';
import {
  User,
  Course,
  Module,
  Lab,
  Assessment,
  UserCourse,
  LabSubmission,
  AssessmentAttempt,
  ModuleProgress
} from '../models/index.js';
import { advancedCurriculum } from './advancedCurriculum.js';
import { advancedLabs } from './advancedLabs.js';
import { advancedAssessments } from './advancedAssessments.js';
import logger from '../utils/logger.js';

// Update database with advanced curriculum
const updateCurriculum = async () => {
  try {
    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      logger.info('Starting curriculum update...');

      // Create the advanced course
      logger.info('Creating advanced course...');
      const course = await Course.create(advancedCurriculum.course, { transaction });
      logger.info(`Created course: ${course.title} (ID: ${course.id})`);

      // Create modules for the course
      logger.info('Creating modules...');
      const modules = await Promise.all(
        advancedCurriculum.modules.map(moduleData =>
          Module.create({
            ...moduleData,
            courseId: course.id
          }, { transaction })
        )
      );
      logger.info(`Created ${modules.length} modules`);

      // Create labs for the modules
      logger.info('Creating labs...');
      const labs = await Promise.all(
        advancedLabs.map(labData => {
          // Find the module by its order number (which is stored as moduleId in our lab data)
          const moduleOrder = labData.moduleId;
          const module = modules.find(m => m.order === moduleOrder);

          if (!module) {
            logger.warn(`Could not find module with order ${moduleOrder} for lab: ${labData.title}`);
            return null;
          }

          // Create a copy of the lab data without the moduleId (we'll set the real ID)
          const { moduleId, ...labDataWithoutModuleId } = labData;

          return Lab.create({
            ...labDataWithoutModuleId,
            moduleId: module.id
          }, { transaction });
        }).filter(lab => lab !== null)
      );
      logger.info(`Created ${labs.length} labs`);

      // Create assessments for the modules
      logger.info('Creating assessments...');
      const assessments = await Promise.all(
        advancedAssessments.map(assessmentData => {
          // Find the module by its order number (which is stored as moduleId in our assessment data)
          const moduleOrder = assessmentData.moduleId;
          const module = modules.find(m => m.order === moduleOrder);

          if (!module) {
            logger.warn(`Could not find module with order ${moduleOrder} for assessment: ${assessmentData.title}`);
            return null;
          }

          // Create a copy of the assessment data without the moduleId (we'll set the real ID)
          const { moduleId, ...assessmentDataWithoutModuleId } = assessmentData;

          return Assessment.create({
            ...assessmentDataWithoutModuleId,
            moduleId: module.id
          }, { transaction });
        }).filter(assessment => assessment !== null)
      );
      logger.info(`Created ${assessments.length} assessments`);

      // Enroll existing users in the new course
      logger.info('Enrolling users in the new course...');
      const users = await User.findAll({ transaction });

      await Promise.all(
        users.map(user =>
          UserCourse.create({
            userId: user.id,
            courseId: course.id,
            role: user.role === 'admin' ? 'instructor' : 'student',
            enrolledAt: new Date(),
            progress: 0
          }, { transaction })
        )
      );
      logger.info(`Enrolled ${users.length} users in the course`);

      // Commit transaction
      await transaction.commit();
      logger.info('Curriculum update completed successfully');
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    logger.error('Curriculum update failed:', error);
    process.exit(1);
  }
};

// Function to check if the advanced course already exists
const checkCourseExists = async () => {
  try {
    const existingCourse = await Course.findOne({
      where: {
        title: advancedCurriculum.course.title
      }
    });

    if (existingCourse) {
      logger.warn(`Course "${advancedCurriculum.course.title}" already exists (ID: ${existingCourse.id})`);

      // Ask user if they want to continue
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question('Do you want to continue and create duplicate content? (y/n) ', async (answer) => {
        readline.close();
        if (answer.toLowerCase() === 'y') {
          await updateCurriculum();
        } else {
          logger.info('Curriculum update cancelled');
          process.exit(0);
        }
      });
    } else {
      await updateCurriculum();
    }
  } catch (error) {
    logger.error('Error checking for existing course:', error);
    process.exit(1);
  }
};

// Run the update
checkCourseExists();
