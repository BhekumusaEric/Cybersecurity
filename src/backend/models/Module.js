import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Module = sequelize.define('Module', {
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
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  videoUrl: {
    type: DataTypes.STRING
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE
  },
  resources: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('resources');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('resources', JSON.stringify(value || []));
    }
  },
  courseId: {
    type: DataTypes.UUID,
    references: {
      model: 'Courses',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  timestamps: true
});

export default Module;
