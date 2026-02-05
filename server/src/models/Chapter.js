const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Chapter = sequelize.define('Chapter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  chapterNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'chapter_number'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'chapters',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['course_id', 'chapter_number']
    }
  ]
});

Chapter.associate = (models) => {
  Chapter.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
  Chapter.hasMany(models.Question, { foreignKey: 'chapter_id', as: 'questions' });
  Chapter.hasMany(models.ExamChapterRequirement, { foreignKey: 'chapter_id', as: 'examRequirements' });
};

module.exports = Chapter;
