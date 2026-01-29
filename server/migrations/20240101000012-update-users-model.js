'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add username and full_name columns
    await queryInterface.addColumn('users', 'username', {
      type: Sequelize.STRING(50),
      allowNull: true,
      unique: true
    });
    await queryInterface.addColumn('users', 'full_name', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
    
    // Copy data from first_name + last_name to full_name and create username from email
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET full_name = CONCAT(first_name, ' ', last_name),
          username = LOWER(REPLACE(SPLIT_PART(email, '@', 1), '.', '_'))
    `);
    
    // Make username not null after data migration
    await queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    });
    
    // Remove old columns
    await queryInterface.removeColumn('users', 'first_name');
    await queryInterface.removeColumn('users', 'last_name');
    await queryInterface.addIndex('users', ['username']);
  },

  async down(queryInterface, Sequelize) {
    // Restore users table
    await queryInterface.addColumn('users', 'first_name', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
    await queryInterface.addColumn('users', 'last_name', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
    
    // Copy data back
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET first_name = SPLIT_PART(full_name, ' ', 1),
          last_name = SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1)
    `);
    
    await queryInterface.removeColumn('users', 'username');
    await queryInterface.removeColumn('users', 'full_name');
  }
};
