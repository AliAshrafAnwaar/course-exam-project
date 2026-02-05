const { sequelize } = require('../config/database');

const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const User = require('./User');
const Course = require('./Course');
const Chapter = require('./Chapter');
const Question = require('./Question');
const Exam = require('./Exam');
const ExamChapterRequirement = require('./ExamChapterRequirement');
const ExamQuestion = require('./ExamQuestion');

const models = {
  Role,
  Permission,
  RolePermission,
  User,
  Course,
  Chapter,
  Question,
  Exam,
  ExamChapterRequirement,
  ExamQuestion
};

// Initialize associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
