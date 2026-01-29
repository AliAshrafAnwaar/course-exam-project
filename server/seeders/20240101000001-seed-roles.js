'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        description: 'System administrator with full access',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'teacher',
        description: 'Teacher who can create courses and exams',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'student',
        description: 'Student who can view exams',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
