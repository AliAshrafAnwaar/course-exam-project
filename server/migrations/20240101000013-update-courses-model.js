'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add created_by column
    await queryInterface.addColumn('courses', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
    
    // Remove total_chapters column
    await queryInterface.removeColumn('courses', 'total_chapters');
    await queryInterface.addIndex('courses', ['created_by']);
  },

  async down(queryInterface, Sequelize) {
    // Remove created_by from courses, add back total_chapters
    await queryInterface.removeColumn('courses', 'created_by');
    await queryInterface.addColumn('courses', 'total_chapters', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  }
};
