'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      // Course permissions
      { name: 'course.create', description: 'Create new courses', created_at: new Date(), updated_at: new Date() },
      { name: 'course.read', description: 'View courses', created_at: new Date(), updated_at: new Date() },
      { name: 'course.update', description: 'Update courses', created_at: new Date(), updated_at: new Date() },
      { name: 'course.delete', description: 'Delete courses', created_at: new Date(), updated_at: new Date() },
      // Chapter permissions
      { name: 'chapter.create', description: 'Create new chapters', created_at: new Date(), updated_at: new Date() },
      { name: 'chapter.read', description: 'View chapters', created_at: new Date(), updated_at: new Date() },
      { name: 'chapter.update', description: 'Update chapters', created_at: new Date(), updated_at: new Date() },
      { name: 'chapter.delete', description: 'Delete chapters', created_at: new Date(), updated_at: new Date() },
      // Question permissions
      { name: 'question.create', description: 'Create new questions', created_at: new Date(), updated_at: new Date() },
      { name: 'question.read', description: 'View questions', created_at: new Date(), updated_at: new Date() },
      { name: 'question.update', description: 'Update questions', created_at: new Date(), updated_at: new Date() },
      { name: 'question.delete', description: 'Delete questions', created_at: new Date(), updated_at: new Date() },
      // Exam permissions
      { name: 'exam.create', description: 'Create new exams', created_at: new Date(), updated_at: new Date() },
      { name: 'exam.read', description: 'View exams', created_at: new Date(), updated_at: new Date() },
      { name: 'exam.update', description: 'Update exams', created_at: new Date(), updated_at: new Date() },
      { name: 'exam.delete', description: 'Delete exams', created_at: new Date(), updated_at: new Date() },
      { name: 'exam.generate', description: 'Generate optimized exams', created_at: new Date(), updated_at: new Date() },
      // User permissions
      { name: 'user.create', description: 'Create new users', created_at: new Date(), updated_at: new Date() },
      { name: 'user.read', description: 'View users', created_at: new Date(), updated_at: new Date() },
      { name: 'user.update', description: 'Update users', created_at: new Date(), updated_at: new Date() },
      { name: 'user.delete', description: 'Delete users', created_at: new Date(), updated_at: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
