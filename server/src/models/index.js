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

// =============================================
// AUTHENTICATION & AUTHORIZATION RELATIONSHIPS
// =============================================

// Role <-> User (1:M)
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// Role <-> Permission (M:N through RolePermission)
Role.belongsToMany(Permission, { 
  through: RolePermission, 
  foreignKey: 'role_id', 
  otherKey: 'permission_id',
  as: 'permissions' 
});
Permission.belongsToMany(Role, { 
  through: RolePermission, 
  foreignKey: 'permission_id', 
  otherKey: 'role_id',
  as: 'roles' 
});

// =============================================
// OWNERSHIP RELATIONSHIPS (created_by)
// =============================================

// User -> Course (1:M)
User.hasMany(Course, { foreignKey: 'created_by', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// User -> Question (1:M)
User.hasMany(Question, { foreignKey: 'created_by', as: 'questions' });
Question.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// User -> Exam (1:M)
User.hasMany(Exam, { foreignKey: 'created_by', as: 'exams' });
Exam.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// =============================================
// CORE SYSTEM RELATIONSHIPS
// =============================================

// Course <-> Chapter (1:M)
Course.hasMany(Chapter, { foreignKey: 'course_id', as: 'chapters' });
Chapter.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Course <-> Exam (1:M)
Course.hasMany(Exam, { foreignKey: 'course_id', as: 'exams' });
Exam.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Chapter <-> Question (1:M)
Chapter.hasMany(Question, { foreignKey: 'chapter_id', as: 'questions' });
Question.belongsTo(Chapter, { foreignKey: 'chapter_id', as: 'chapter' });

// Exam <-> ExamChapterRequirement (1:M)
Exam.hasMany(ExamChapterRequirement, { foreignKey: 'exam_id', as: 'chapterRequirements' });
ExamChapterRequirement.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });

// Chapter <-> ExamChapterRequirement (1:M)
Chapter.hasMany(ExamChapterRequirement, { foreignKey: 'chapter_id', as: 'examRequirements' });
ExamChapterRequirement.belongsTo(Chapter, { foreignKey: 'chapter_id', as: 'chapter' });

// Exam <-> Question (M:N through ExamQuestion)
Exam.belongsToMany(Question, { 
  through: ExamQuestion, 
  foreignKey: 'exam_id', 
  otherKey: 'question_id',
  as: 'questions' 
});
Question.belongsToMany(Exam, { 
  through: ExamQuestion, 
  foreignKey: 'question_id', 
  otherKey: 'exam_id',
  as: 'exams' 
});

// Direct access to junction table
Exam.hasMany(ExamQuestion, { foreignKey: 'exam_id', as: 'examQuestions' });
ExamQuestion.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });
Question.hasMany(ExamQuestion, { foreignKey: 'question_id', as: 'examQuestions' });
ExamQuestion.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

module.exports = {
  sequelize,
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
