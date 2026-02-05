const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'courses',
  timestamps: true,
  underscored: true
});

Course.associate = (models) => {
  Course.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
  Course.hasMany(models.Chapter, { foreignKey: 'course_id', as: 'chapters' });
  Course.hasMany(models.Exam, { foreignKey: 'course_id', as: 'exams' });
};

module.exports = Course;
