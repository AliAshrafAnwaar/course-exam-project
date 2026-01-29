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
  chapter_number: {
    type: DataTypes.INTEGER,
    allowNull: false
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

module.exports = Chapter;
