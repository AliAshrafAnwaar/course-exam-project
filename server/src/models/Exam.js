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
    allowNull: true,
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

Exam.associate = (models) => {
  Exam.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
  Exam.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
  Exam.hasMany(models.ExamChapterRequirement, { foreignKey: 'exam_id', as: 'chapterRequirements' });
  Exam.belongsToMany(models.Question, { 
    through: models.ExamQuestion, 
    foreignKey: 'exam_id', 
    otherKey: 'question_id',
    as: 'questions' 
  });
  Exam.hasMany(models.ExamQuestion, { foreignKey: 'exam_id', as: 'examQuestions' });
};

module.exports = Exam;
