const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ExamQuestion = sequelize.define('ExamQuestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'exams',
      key: 'id'
    }
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

ExamQuestion.associate = (models) => {
  ExamQuestion.belongsTo(models.Exam, { foreignKey: 'exam_id', as: 'exam' });
  ExamQuestion.belongsTo(models.Question, { foreignKey: 'question_id', as: 'question' });
};

module.exports = ExamQuestion;
