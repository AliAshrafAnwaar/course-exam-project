'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename name to title
    await queryInterface.renameColumn('chapters', 'name', 'title');
  },

  async down(queryInterface, Sequelize) {
    // Rename title back to name
    await queryInterface.renameColumn('chapters', 'title', 'name');
  }
};
