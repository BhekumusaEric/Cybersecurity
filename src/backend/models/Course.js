import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Course = sequelize.define('Course', {
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
  thumbnail: {
    type: DataTypes.STRING
  },
  duration: {
    type: DataTypes.INTEGER, // in weeks
    allowNull: false
  },
  level: {
    type: DataTypes.STRING,
    defaultValue: 'beginner'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE
  },
  prerequisites: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('prerequisites');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('prerequisites', JSON.stringify(value || []));
    }
  },
  learningOutcomes: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('learningOutcomes');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('learningOutcomes', JSON.stringify(value || []));
    }
  },
  tags: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('tags');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
    }
  }
}, {
  timestamps: true
});

export default Course;
