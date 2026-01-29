const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Exam = sequelize.define('Exam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  total_questions: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  req_simple_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  req_difficult_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  req_reminding_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  req_understanding_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  req_creativity_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'exams',
  timestamps: true,
  underscored: true
});

module.exports = Exam;
