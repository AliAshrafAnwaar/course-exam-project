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
    type: DataTypes.STRING(500),
    allowNull: false
  },
  choice_2: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  choice_3: {
    type: DataTypes.STRING(500),
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
    allowNull: false,
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

module.exports = Question;
