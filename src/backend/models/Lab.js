import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Lab = sequelize.define('Lab', {
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
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  difficulty: {
    type: DataTypes.STRING,
    defaultValue: 'medium'
  },
  estimatedTime: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false
  },
  environmentType: {
    type: DataTypes.STRING,
    defaultValue: 'browser'
  },
  environmentConfig: {
    type: DataTypes.TEXT,
    defaultValue: '{}',
    get() {
      const value = this.getDataValue('environmentConfig');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('environmentConfig', JSON.stringify(value || {}));
    }
  },
  tools: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('tools');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('tools', JSON.stringify(value || []));
    }
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE
  },
  submissionType: {
    type: DataTypes.STRING,
    defaultValue: 'text'
  },
  submissionInstructions: {
    type: DataTypes.TEXT
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

export default Lab;
