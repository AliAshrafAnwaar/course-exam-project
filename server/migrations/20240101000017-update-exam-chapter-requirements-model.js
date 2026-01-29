'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename question_count to required_question_count
    await queryInterface.renameColumn('exam_chapter_requirements', 'question_count', 'required_question_count');
  },

  async down(queryInterface, Sequelize) {
    // Rename back
    await queryInterface.renameColumn('exam_chapter_requirements', 'required_question_count', 'question_count');
  }
};
