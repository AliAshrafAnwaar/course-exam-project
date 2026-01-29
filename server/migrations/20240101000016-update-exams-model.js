'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename columns to req_* prefix
    await queryInterface.renameColumn('exams', 'simple_count', 'req_simple_count');
    await queryInterface.renameColumn('exams', 'difficult_count', 'req_difficult_count');
    await queryInterface.renameColumn('exams', 'reminding_count', 'req_reminding_count');
    await queryInterface.renameColumn('exams', 'understanding_count', 'req_understanding_count');
    await queryInterface.renameColumn('exams', 'creativity_count', 'req_creativity_count');
  },

  async down(queryInterface, Sequelize) {
    // Rename exams columns back
    await queryInterface.renameColumn('exams', 'req_simple_count', 'simple_count');
    await queryInterface.renameColumn('exams', 'req_difficult_count', 'difficult_count');
    await queryInterface.renameColumn('exams', 'req_reminding_count', 'reminding_count');
    await queryInterface.renameColumn('exams', 'req_understanding_count', 'understanding_count');
    await queryInterface.renameColumn('exams', 'req_creativity_count', 'creativity_count');
  }
};
