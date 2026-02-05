const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chapter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'chapters',
      key: 'id'
    }
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  choice_1: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  choice_2: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  choice_3: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  correct_answer: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 3
    }
  },
  difficulty: {
    type: DataTypes.ENUM('simple', 'difficult'),
    allowNull: false
  },
  objective: {
    type: DataTypes.ENUM('reminding', 'understanding', 'creativity'),
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'questions',
  timestamps: true,
  underscored: true
});

Question.associate = (models) => {
  Question.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
  Question.belongsTo(models.Chapter, { foreignKey: 'chapter_id', as: 'chapter' });
  Question.belongsToMany(models.Exam, { 
    through: models.ExamQuestion, 
    foreignKey: 'question_id', 
    otherKey: 'exam_id',
    as: 'exams' 
  });
  Question.hasMany(models.ExamQuestion, { foreignKey: 'question_id', as: 'examQuestions' });
};

module.exports = Question;
