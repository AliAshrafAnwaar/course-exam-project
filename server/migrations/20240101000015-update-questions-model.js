'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename correct_choice to correct_answer
    await queryInterface.renameColumn('questions', 'correct_choice', 'correct_answer');
    
    // Add created_by column
    await queryInterface.addColumn('questions', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
    await queryInterface.addIndex('questions', ['created_by']);
  },

  async down(queryInterface, Sequelize) {
    // Remove created_by from questions, rename correct_answer back
    await queryInterface.removeColumn('questions', 'created_by');
    await queryInterface.renameColumn('questions', 'correct_answer', 'correct_choice');
  }
};
