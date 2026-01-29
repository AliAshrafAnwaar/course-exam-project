const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ExamQuestion = sequelize.define('ExamQuestion', {
  exam_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'exams',
      key: 'id'
    }
  },
  question_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'questions',
      key: 'id'
    }
  },
  question_order: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'exam_questions',
  timestamps: true,
  underscored: true,
  updatedAt: false
});

module.exports = ExamQuestion;
