'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add resource and action columns to permissions
    await queryInterface.addColumn('permissions', 'resource', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'unknown'
    });
    await queryInterface.addColumn('permissions', 'action', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'unknown'
    });
    await queryInterface.addIndex('permissions', ['resource']);
    await queryInterface.addIndex('permissions', ['action']);
  },

  async down(queryInterface, Sequelize) {
    // Remove resource and action from permissions
    await queryInterface.removeColumn('permissions', 'resource');
    await queryInterface.removeColumn('permissions', 'action');
  }
};
