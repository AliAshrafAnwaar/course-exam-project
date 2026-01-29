const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ExamChapterRequirement = sequelize.define('ExamChapterRequirement', {
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
  chapter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'chapters',
      key: 'id'
    }
  },
  required_question_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'exam_chapter_requirements',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['exam_id', 'chapter_id']
    }
  ]
});

module.exports = ExamChapterRequirement;
