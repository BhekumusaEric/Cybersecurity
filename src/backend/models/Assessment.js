import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'quiz'
  },
  timeLimit: {
    type: DataTypes.INTEGER, // in minutes, null means no time limit
    allowNull: true
  },
  passingScore: {
    type: DataTypes.INTEGER, // percentage
    defaultValue: 70
  },
  maxAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE
  },
  questions: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('questions');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('questions', JSON.stringify(value || []));
    }
  },
  randomizeQuestions: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  showAnswers: {
    type: DataTypes.STRING,
    defaultValue: 'after_submission'
  },
  moduleId: {
    type: DataTypes.UUID,
    references: {
      model: 'Modules',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  timestamps: true
});

export default Assessment;
