import User from './User.js';
import Course from './Course.js';
import Module from './Module.js';
import Lab from './Lab.js';
import Assessment from './Assessment.js';
import { sequelize } from '../config/database.js';

// Define relationships between models

// User-Course relationships (many-to-many)
const UserCourse = sequelize.define('UserCourse', {
  role: {
    type: sequelize.Sequelize.STRING,
    defaultValue: 'student'
  },
  enrolledAt: {
    type: sequelize.Sequelize.DATE,
    defaultValue: sequelize.Sequelize.NOW
  },
  completedAt: {
    type: sequelize.Sequelize.DATE
  },
  progress: {
    type: sequelize.Sequelize.INTEGER, // percentage
    defaultValue: 0
  }
});

User.belongsToMany(Course, { through: UserCourse });
Course.belongsToMany(User, { through: UserCourse });

// Course-Module relationship (one-to-many)
Course.hasMany(Module, {
  foreignKey: 'courseId',
  onDelete: 'CASCADE'
});
Module.belongsTo(Course, {
  foreignKey: 'courseId'
});

// Module-Lab relationship (one-to-many)
Module.hasMany(Lab, {
  foreignKey: 'moduleId',
  onDelete: 'CASCADE'
});
Lab.belongsTo(Module, {
  foreignKey: 'moduleId'
});

// Module-Assessment relationship (one-to-many)
Module.hasMany(Assessment, {
  foreignKey: 'moduleId',
  onDelete: 'CASCADE'
});
Assessment.belongsTo(Module, {
  foreignKey: 'moduleId'
});

// User-Lab relationships (many-to-many for submissions)
const LabSubmission = sequelize.define('LabSubmission', {
  content: {
    type: sequelize.Sequelize.TEXT
  },
  fileUrl: {
    type: sequelize.Sequelize.STRING
  },
  status: {
    type: sequelize.Sequelize.STRING,
    defaultValue: 'submitted'
  },
  grade: {
    type: sequelize.Sequelize.INTEGER
  },
  feedback: {
    type: sequelize.Sequelize.TEXT
  },
  submittedAt: {
    type: sequelize.Sequelize.DATE,
    defaultValue: sequelize.Sequelize.NOW
  },
  gradedAt: {
    type: sequelize.Sequelize.DATE
  }
});

User.belongsToMany(Lab, { through: LabSubmission });
Lab.belongsToMany(User, { through: LabSubmission });

// User-Assessment relationships (many-to-many for attempts)
const AssessmentAttempt = sequelize.define('AssessmentAttempt', {
  answers: {
    type: sequelize.Sequelize.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('answers');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('answers', JSON.stringify(value || []));
    }
  },
  score: {
    type: sequelize.Sequelize.INTEGER
  },
  passed: {
    type: sequelize.Sequelize.BOOLEAN,
    defaultValue: false
  },
  startedAt: {
    type: sequelize.Sequelize.DATE,
    defaultValue: sequelize.Sequelize.NOW
  },
  completedAt: {
    type: sequelize.Sequelize.DATE
  },
  timeSpent: {
    type: sequelize.Sequelize.INTEGER // in seconds
  }
});

User.belongsToMany(Assessment, { through: AssessmentAttempt });
Assessment.belongsToMany(User, { through: AssessmentAttempt });

export {
  User,
  Course,
  Module,
  Lab,
  Assessment,
  UserCourse,
  LabSubmission,
  AssessmentAttempt,
  sequelize
};
