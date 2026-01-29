'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      // Course permissions
      { name: 'create_course', resource: 'course', action: 'create', description: 'Create new courses', created_at: new Date(), updated_at: new Date() },
      { name: 'read_course', resource: 'course', action: 'read', description: 'View courses', created_at: new Date(), updated_at: new Date() },
      { name: 'update_course', resource: 'course', action: 'update', description: 'Update courses', created_at: new Date(), updated_at: new Date() },
      { name: 'delete_course', resource: 'course', action: 'delete', description: 'Delete courses', created_at: new Date(), updated_at: new Date() },
      // Chapter permissions
      { name: 'create_chapter', resource: 'chapter', action: 'create', description: 'Create new chapters', created_at: new Date(), updated_at: new Date() },
      { name: 'read_chapter', resource: 'chapter', action: 'read', description: 'View chapters', created_at: new Date(), updated_at: new Date() },
      { name: 'update_chapter', resource: 'chapter', action: 'update', description: 'Update chapters', created_at: new Date(), updated_at: new Date() },
      { name: 'delete_chapter', resource: 'chapter', action: 'delete', description: 'Delete chapters', created_at: new Date(), updated_at: new Date() },
      // Question permissions
      { name: 'create_question', resource: 'question', action: 'create', description: 'Create new questions', created_at: new Date(), updated_at: new Date() },
      { name: 'read_question', resource: 'question', action: 'read', description: 'View questions', created_at: new Date(), updated_at: new Date() },
      { name: 'update_question', resource: 'question', action: 'update', description: 'Update questions', created_at: new Date(), updated_at: new Date() },
      { name: 'delete_question', resource: 'question', action: 'delete', description: 'Delete questions', created_at: new Date(), updated_at: new Date() },
      // Exam permissions
      { name: 'create_exam', resource: 'exam', action: 'create', description: 'Create new exams', created_at: new Date(), updated_at: new Date() },
      { name: 'read_exam', resource: 'exam', action: 'read', description: 'View exams', created_at: new Date(), updated_at: new Date() },
      { name: 'update_exam', resource: 'exam', action: 'update', description: 'Update exams', created_at: new Date(), updated_at: new Date() },
      { name: 'delete_exam', resource: 'exam', action: 'delete', description: 'Delete exams', created_at: new Date(), updated_at: new Date() },
      // User permissions
      { name: 'create_user', resource: 'user', action: 'create', description: 'Create new users', created_at: new Date(), updated_at: new Date() },
      { name: 'read_user', resource: 'user', action: 'read', description: 'View users', created_at: new Date(), updated_at: new Date() },
      { name: 'update_user', resource: 'user', action: 'update', description: 'Update users', created_at: new Date(), updated_at: new Date() },
      { name: 'delete_user', resource: 'user', action: 'delete', description: 'Delete users', created_at: new Date(), updated_at: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
